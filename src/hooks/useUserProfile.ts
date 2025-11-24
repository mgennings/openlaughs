import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getUserProfile } from '@/graphql/queries';
import { useAuthContext } from '@/auth';
import type { UserProfile } from '@/API';
import type { UserRole } from '@/config/constants';

const client = generateClient({ authMode: 'userPool' });

interface UseUserProfileResult {
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch the current user's UserProfile from the database
 * Returns the profile, role, loading state, and error if any
 */
export const useUserProfile = (): UseUserProfileResult => {
  const { currentUser } = useAuthContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!currentUser?.email) {
      setLoading(false);
      setError('No user email found');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get the Cognito user ID to fetch profile by ID
      const { getCurrentUser: getCognitoUser } = await import(
        'aws-amplify/auth'
      );
      const cognitoUser = await getCognitoUser();
      const userId = cognitoUser.userId;

      // Fetch UserProfile by ID (Cognito sub)
      const result = await client.graphql({
        query: (getUserProfile as string).replace(/__typename/g, ''),
        variables: { id: userId },
      });

      if ('data' in result && result.data?.getUserProfile) {
        const userProfile = result.data.getUserProfile;

        // Security check: verify the email matches (in case of ID mismatch)
        if (userProfile.email !== currentUser.email) {
          console.error('Profile email mismatch - security issue detected');
          setProfile(null);
          setRole(null);
          setError('Security error: Profile email mismatch');
          return;
        }

        setProfile(userProfile);
        setRole((userProfile.role as UserRole) || null);
      } else {
        setProfile(null);
        setRole(null);
        setError('User profile not found');
      }
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      setError(err.message || 'Failed to fetch user profile');
      setProfile(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [currentUser?.email]);

  return {
    profile,
    role,
    loading,
    error,
    refetch: fetchProfile,
  };
};
