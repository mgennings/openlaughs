import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ScreenLoader } from '@/components/loaders';
import { useAuthContext } from './useAuthContext';
import { generateClient } from 'aws-amplify/api';
import { listUserProfiles } from '@/graphql/queries';

const client = generateClient({ authMode: 'userPool' });

const RequireOnboarding = () => {
  const { auth, currentUser, loading } = useAuthContext();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!auth || !currentUser?.email || loading) {
        setCheckingOnboarding(false);
        return;
      }

      try {
        // Check if UserProfile exists for this user
        const result = await client.graphql({
          query: (listUserProfiles as string).replace(/__typename/g, ''),
          variables: {
            filter: {
              email: { eq: currentUser.email },
            },
            limit: 1,
          },
        });

        const hasProfile =
          'data' in result && result.data?.listUserProfiles?.items?.length > 0;
        setHasCompletedOnboarding(hasProfile);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // On error, assume onboarding is needed
        setHasCompletedOnboarding(false);
      } finally {
        setCheckingOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [auth, currentUser?.email, loading]);

  if (loading || checkingOnboarding) {
    return <ScreenLoader />;
  }

  if (!auth) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};

export { RequireOnboarding };
