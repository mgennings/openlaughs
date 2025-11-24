import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { generateClient } from 'aws-amplify/api';
import { getUserProfile } from '@/graphql/queries';
import { ScreenLoader } from '@/components/loaders';

const client = generateClient({ authMode: 'userPool' });

const CognitoCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>('Signing you in...');
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const handleOAuthCallback = () => {
      setStatus('Processing sign in...');

      // Listen for the auth event from Amplify Hub
      const hubListener = Hub.listen('auth', async ({ payload }) => {
        if (!mounted) return;

        console.log('Auth Hub event:', payload);

        switch (payload.event) {
          case 'signInWithRedirect':
            setStatus('Verifying your account...');
            try {
              const user = await getCurrentUser();
              const session = await fetchAuthSession();
              const idToken = session.tokens?.idToken;

              console.log('OAuth user:', user);
              console.log('ID Token payload:', idToken?.payload);

              const email = idToken?.payload?.email as string | undefined;
              setCurrentUserEmail(email || null);
            } catch (error) {
              console.error('Error getting user after OAuth:', error);
              setStatus('Sign in failed. Redirecting...');
              setTimeout(() => {
                navigate('/auth/login', { replace: true });
              }, 1000);
            }
            break;

          case 'signInWithRedirect_failure':
            console.error('OAuth sign in failed:', payload.data);
            setStatus('Sign in failed. Redirecting...');
            setTimeout(() => {
              navigate('/auth/login', { replace: true });
            }, 1000);
            break;
        }
      });

      // Poll for authenticated user (with retry logic)
      const checkAuth = async (retries = 10) => {
        if (!mounted) return;

        for (let i = 0; i < retries; i++) {
          try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const user = await getCurrentUser();
            const session = await fetchAuthSession();
            const idToken = session.tokens?.idToken;
            const email = idToken?.payload?.email as string | undefined;

            if (mounted && email) {
              console.log('User authenticated:', user);
              console.log('Email from ID token:', email);
              setCurrentUserEmail(email);
            }
            return;
          } catch (error) {
            console.log(`Auth check attempt ${i + 1}/${retries}:`, error);
            if (i === retries - 1) {
              console.error('Failed to authenticate after retries');
              if (mounted) {
                setStatus('Sign in failed. Redirecting...');
                setTimeout(() => {
                  navigate('/auth/login', { replace: true });
                }, 1000);
              }
            }
          }
        }
      };

      checkAuth();

      return () => {
        mounted = false;
        hubListener();
      };
    };

    return handleOAuthCallback();
  }, [navigate]);

  // Separate effect to handle post-verification routing
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!currentUserEmail) return;

      try {
        setStatus('Checking your profile...');

        // Get Cognito user ID
        const cognitoUser = await getCurrentUser();
        const userId = cognitoUser.userId;

        // Check if user has completed onboarding
        const result = await client.graphql({
          query: (getUserProfile as string).replace(/__typename/g, ''),
          variables: { id: userId },
        });

        const hasProfile = 'data' in result && !!result.data?.getUserProfile;

        if (hasProfile) {
          // User has completed onboarding, go to dashboard
          setStatus('Welcome back! Redirecting to dashboard...');
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 500);
        } else {
          // New user, needs onboarding
          setStatus('Setting up your profile...');
          setTimeout(() => {
            navigate('/onboarding', { replace: true });
          }, 500);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // On error, send to onboarding to be safe
        navigate('/onboarding', { replace: true });
      }
    };

    checkOnboarding();
  }, [currentUserEmail, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <ScreenLoader />
      <p className="text-sm text-gray-600">{status}</p>
    </div>
  );
};

export { CognitoCallback };
