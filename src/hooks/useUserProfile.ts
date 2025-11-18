import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listUserProfiles } from '@/graphql/queries';
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

      const result = await client.graphql({
        query: (listUserProfiles as string).replace(/__typename/g, ''),
        variables: {
          filter: {
            email: { eq: currentUser.email },
          },
          limit: 1,
        },
      });

      if (
        'data' in result &&
        result.data?.listUserProfiles?.items &&
        result.data.listUserProfiles.items.length > 0
      ) {
        const userProfile = result.data.listUserProfiles.items[0];
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
