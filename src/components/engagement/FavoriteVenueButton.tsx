import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { KeenIcon } from '@/components';
import { createFavoriteVenue, deleteFavoriteVenue } from '@/graphql/mutations';
import { listFavoriteVenues } from '@/graphql/queries';
import type { FavoriteVenue } from '@/API';
import { useUserProfile } from '@/hooks';

const client = generateClient({ authMode: 'userPool' });

interface FavoriteVenueButtonProps {
  venueId: string;
  onFavoriteChange?: (isFavorited: boolean) => void;
  variant?: 'icon' | 'button' | 'compact';
  showCount?: boolean;
}

const FavoriteVenueButton = ({
  venueId,
  onFavoriteChange,
  variant = 'button',
  showCount = false,
}: FavoriteVenueButtonProps) => {
  const { profile, loading: profileLoading } = useUserProfile();
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!profile?.id) return;

      try {
        const result = await client.graphql({
          query: listFavoriteVenues,
          variables: {
            filter: {
              userProfileId: { eq: profile.id },
              venueId: { eq: venueId },
            },
          },
        });

        const favorites = result.data.listFavoriteVenues.items.filter(
          Boolean,
        ) as FavoriteVenue[];

        if (favorites.length > 0) {
          setIsFavorited(true);
          setFavoriteId(favorites[0].id);
        }

        if (showCount) {
          const countResult = await client.graphql({
            query: listFavoriteVenues,
            variables: {
              filter: {
                venueId: { eq: venueId },
              },
            },
          });
          setFavoriteCount(countResult.data.listFavoriteVenues.items.length);
        }
      } catch (error) {
        console.error('Error checking favorite venue status:', error);
      }
    };

    void checkFavorite();
  }, [profile?.id, venueId, showCount]);

  const handleToggleFavorite = async () => {
    if (!profile?.id || isLoading) return;

    setIsLoading(true);

    try {
      if (isFavorited && favoriteId) {
        await client.graphql({
          query: deleteFavoriteVenue,
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
        const result = await client.graphql({
          query: createFavoriteVenue,
          variables: {
            input: {
              userProfileId: profile.id,
              venueId,
            },
          },
        });

        const newFavorite = result.data.createFavoriteVenue as FavoriteVenue;
        setIsFavorited(true);
        setFavoriteId(newFavorite.id);
        if (showCount) setFavoriteCount(prev => prev + 1);
        onFavoriteChange?.(true);
      }
    } catch (error) {
      console.error('Error toggling favorite venue:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (profileLoading) {
    return null;
  }

  if (!profile) {
    return null;
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={`btn btn-icon btn-sm ${
          isFavorited ? 'btn-warning' : 'btn-light'
        } ${isLoading ? 'opacity-50' : ''}`}
        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        <KeenIcon
          icon={isFavorited ? 'star' : 'star-outline'}
          className={isFavorited ? 'text-white' : ''}
        />
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={`flex items-center gap-1.5 text-sm ${
          isFavorited ? 'text-warning' : 'text-gray-700 hover:text-warning'
        } ${isLoading ? 'opacity-50' : ''}`}
      >
        <KeenIcon icon={isFavorited ? 'star' : 'star-outline'} />
        <span>{isFavorited ? 'Favorited' : 'Favorite'}</span>
        {showCount && favoriteCount > 0 && (
          <span className="text-gray-500">({favoriteCount})</span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`btn ${
        isFavorited ? 'btn-warning' : 'btn-light'
      } ${isLoading ? 'opacity-50' : ''}`}
    >
      <KeenIcon
        icon={isFavorited ? 'star' : 'star-outline'}
        className={isFavorited ? 'text-white' : ''}
      />
      {isFavorited ? 'Favorited' : 'Favorite'}
      {showCount && favoriteCount > 0 && (
        <span className="badge badge-sm bg-white/20 ml-2">{favoriteCount}</span>
      )}
    </button>
  );
};

export { FavoriteVenueButton };
