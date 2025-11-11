import { useEffect, useState } from 'react';
import { useGraphQL } from '@/lib/useGraphQL';
import { listUserProfiles } from '@/graphql/queries';
import { getPublicUrl } from '@/lib/storage';
import { useAuthContext } from '@/auth/useAuthContext';
import type { UserProfile } from '@/API';

/**
 * Hook to fetch and return the current user's avatar URL from their profile
 * @param email - Optional email to fetch profile for. If not provided, uses currentUser from auth context
 * @returns The avatar URL string, or undefined if no avatar is set
 */
export function useUserAvatar(email?: string) {
  const { execute } = useGraphQL();
  const { currentUser } = useAuthContext();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();

  const userEmail = email || currentUser?.email;

  useEffect(() => {
    if (!userEmail) return;

    const init = async () => {
      try {
        const data = await execute<{
          listUserProfiles: { items: (UserProfile | null)[] };
        }>(listUserProfiles, {
          variables: { filter: { email: { eq: userEmail } }, limit: 1 },
        });

        const profile = data.listUserProfiles.items.filter(Boolean)[0] as
          | UserProfile
          | undefined;

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
  }, [userEmail, execute]);

  return avatarUrl;
}
