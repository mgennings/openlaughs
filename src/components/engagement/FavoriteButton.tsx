import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { KeenIcon } from '@/components';
import {
  createFavoriteComedian,
  deleteFavoriteComedian,
} from '@/graphql/mutations';
import { listFavoriteComedians } from '@/graphql/queries';
import type { FavoriteComedian } from '@/API';
import { useUserProfile } from '@/hooks';

const client = generateClient({ authMode: 'userPool' });

interface FavoriteButtonProps {
  comedianId: string;
  onFavoriteChange?: (isFavorited: boolean) => void;
  variant?: 'icon' | 'button' | 'compact';
  showCount?: boolean;
}

const FavoriteButton = ({
  comedianId,
  onFavoriteChange,
  variant = 'button',
  showCount = false,
}: FavoriteButtonProps) => {
  const { profile, loading: profileLoading } = useUserProfile();
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!profile?.id) return;

      try {
        // Check if user has favorited this comedian
        const result = await client.graphql({
          query: listFavoriteComedians,
          variables: {
            filter: {
              userProfileId: { eq: profile.id },
              comedianId: { eq: comedianId },
            },
          },
        });

        const favorites = result.data.listFavoriteComedians.items.filter(
          Boolean,
        ) as FavoriteComedian[];

        if (favorites.length > 0) {
          setIsFavorited(true);
          setFavoriteId(favorites[0].id);
        }

        // Get total favorite count if needed
        if (showCount) {
          const countResult = await client.graphql({
            query: listFavoriteComedians,
            variables: {
              filter: {
                comedianId: { eq: comedianId },
              },
            },
          });
          setFavoriteCount(countResult.data.listFavoriteComedians.items.length);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    void checkFavorite();
  }, [profile?.id, comedianId, showCount]);

  const handleToggleFavorite = async () => {
    if (!profile?.id || isLoading) return;

    setIsLoading(true);

    try {
      if (isFavorited && favoriteId) {
        // Unfavorite
        await client.graphql({
          query: deleteFavoriteComedian,
          variables: {
            input: {
              id: favoriteId,
            },
          },
        });

        setIsFavorited(false);
        setFavoriteId(null);
        if (showCount) setFavoriteCount(prev => Math.max(0, prev - 1));
        onFavoriteChange?.(false);
      } else {
        // Favorite
        const result = await client.graphql({
          query: createFavoriteComedian,
          variables: {
            input: {
              userProfileId: profile.id,
              comedianId,
            },
          },
        });

        const newFavorite = result.data
          .createFavoriteComedian as FavoriteComedian;
        setIsFavorited(true);
        setFavoriteId(newFavorite.id);
        if (showCount) setFavoriteCount(prev => prev + 1);
        onFavoriteChange?.(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (profileLoading) {
    return null;
  }

  if (!profile) {
    return null; // User not logged in
  }

  // Icon variant (just the heart icon)
  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={`btn btn-icon btn-sm ${
          isFavorited ? 'btn-danger' : 'btn-light'
        } ${isLoading ? 'opacity-50' : ''}`}
        title={isFavorited ? 'Unfavorite' : 'Favorite'}
      >
        <KeenIcon
          icon={isFavorited ? 'heart' : 'heart-outline'}
          className={isFavorited ? 'text-white' : ''}
        />
      </button>
    );
  }

  // Compact variant (icon + text, no border)
  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={`flex items-center gap-1.5 text-sm ${
          isFavorited ? 'text-danger' : 'text-gray-700 hover:text-danger'
        } ${isLoading ? 'opacity-50' : ''}`}
      >
        <KeenIcon icon={isFavorited ? 'heart' : 'heart-outline'} />
        <span>{isFavorited ? 'Following' : 'Follow'}</span>
        {showCount && favoriteCount > 0 && (
          <span className="text-gray-500">({favoriteCount})</span>
        )}
      </button>
    );
  }

  // Button variant (full button with icon + text)
  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`btn btn-sm ${
        isFavorited ? 'btn-danger' : 'btn-light'
      } ${isLoading ? 'opacity-50' : ''}`}
    >
      <KeenIcon
        icon={isFavorited ? 'heart' : 'heart-outline'}
        className={isFavorited ? 'text-white' : ''}
      />
      {isFavorited ? 'Following' : 'Follow'}
      {showCount && favoriteCount > 0 && (
        <span className="badge badge-sm bg-white/20 ml-2">{favoriteCount}</span>
      )}
    </button>
  );
};

export { FavoriteButton };
