import { useEffect, useState } from 'react';
import { useGraphQL } from '@/lib/useGraphQL';
import { getUserProfile } from '@/graphql/queries';
import { getPublicUrl } from '@/lib/storage';
import { useAuthContext } from '@/auth/useAuthContext';
import { getCurrentUser } from 'aws-amplify/auth';
import type { UserProfile } from '@/API';

/**
 * Hook to fetch and return the current user's avatar URL from their profile
 * @returns The avatar URL string, or undefined if no avatar is set
 */
export function useUserAvatar() {
  const { execute } = useGraphQL();
  const { currentUser } = useAuthContext();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!currentUser?.email) return;

    const init = async () => {
      try {
        // Get Cognito user ID
        const cognitoUser = await getCurrentUser();
        const userId = cognitoUser.userId;

        const data = await execute<{
          getUserProfile: UserProfile | null;
        }>(getUserProfile, {
          variables: { id: userId },
        });

        const profile = data.getUserProfile;

        if (profile?.profileImageKey) {
          const url = await getPublicUrl(profile.profileImageKey);
          setAvatarUrl(url.toString());
        } else {
          setAvatarUrl(undefined);
        }
      } catch (error) {
        console.error('Failed to fetch user avatar:', error);
        setAvatarUrl(undefined);
      }
    };

    void init();
  }, [currentUser?.email, execute]);

  return avatarUrl;
}
