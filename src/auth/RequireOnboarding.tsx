import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { ScreenLoader } from '@/components/loaders';
import { useAuthContext } from './useAuthContext';
import { generateClient } from 'aws-amplify/api';
import { getUserProfile } from '@/graphql/queries';
import { type UserRole } from '@/config/constants';

const client = generateClient({ authMode: 'userPool' });

// Valid roles that indicate onboarding is complete
const VALID_ROLES: UserRole[] = ['comedian', 'fan', 'promoter', 'admin'];

const RequireOnboarding = () => {
  const { auth, currentUser, loading } = useAuthContext();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  // Cache the result to avoid repeated queries when auth state changes
  // But we'll clear it when navigating to force a fresh check after profile creation
  const cachedResult = useRef<{ userId: string; hasCompleted: boolean } | null>(
    null,
  );

  // Clear cache when component mounts (e.g., after profile creation)
  useEffect(() => {
    // Clear cache if we're coming from onboarding page
    const fromOnboarding = sessionStorage.getItem('fromOnboarding');
    if (fromOnboarding === 'true') {
      cachedResult.current = null;
      sessionStorage.removeItem('fromOnboarding');
      sessionStorage.removeItem('createdProfileId');
    }
  }, []);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!auth || !currentUser?.email || loading) {
        setCheckingOnboarding(false);
        return;
      }

      try {
        // Get the Cognito user ID to fetch profile by ID
        const { getCurrentUser: getCognitoUser } = await import(
          'aws-amplify/auth'
        );
        const cognitoUser = await getCognitoUser();
        const userId = cognitoUser.userId;

        // Use cached result if available and userId matches
        if (cachedResult.current && cachedResult.current.userId === userId) {
          setHasCompletedOnboarding(cachedResult.current.hasCompleted);
          setCheckingOnboarding(false);
          return;
        }

        // Fetch UserProfile by ID (Cognito sub)
        // This is the most reliable way since the ID should match the owner
        const result = await client.graphql({
          query: (getUserProfile as string).replace(/__typename/g, ''),
          variables: { id: userId },
        });

        if ('data' in result && result.data?.getUserProfile) {
          const profile = result.data.getUserProfile;

          // Security check: verify the email matches
          if (profile.email !== currentUser.email) {
            console.error('Profile email mismatch - security issue detected');
            setHasCompletedOnboarding(false);
            setCheckingOnboarding(false);
            return;
          }

          // Check if profile has a valid role
          const hasValidRole =
            profile.role && VALID_ROLES.includes(profile.role as UserRole);
          const hasCompleted = hasValidRole && !!profile.id;

          // Cache the result
          cachedResult.current = {
            userId,
            hasCompleted,
          };

          setHasCompletedOnboarding(hasCompleted);
        } else {
          // No profile found
          cachedResult.current = {
            userId,
            hasCompleted: false,
          };
          setHasCompletedOnboarding(false);
        }
      } catch (error: any) {
        console.error('Error checking onboarding status:', error);

        // For errors, check if we have a cached result
        if (cachedResult.current) {
          setHasCompletedOnboarding(cachedResult.current.hasCompleted);
        } else {
          setHasCompletedOnboarding(false);
        }
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
