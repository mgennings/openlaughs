import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { KeenIcon } from '@/components';
import { listFavoriteComedians, getComedian } from '@/graphql/queries';
import type { FavoriteComedian, Comedian } from '@/API';
import { useUserProfile } from '@/hooks';
import { getPublicUrl } from '@/lib/storage';

const client = generateClient({ authMode: 'userPool' });

const FavoriteComediansSection = () => {
  const { profile, loading: profileLoading } = useUserProfile();
  const [favorites, setFavorites] = useState<
    Array<{ favorite: FavoriteComedian; comedian: Comedian }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!profile?.id) return;

      try {
        setLoading(true);

        const favoritesResult = await client.graphql({
          query: listFavoriteComedians,
          variables: {
            filter: {
              userProfileId: { eq: profile.id },
            },
          },
        });

        const favoritesList =
          favoritesResult.data.listFavoriteComedians.items.filter(
            Boolean,
          ) as FavoriteComedian[];

        // Fetch comedian details for each favorite
        const favoritesWithComedians = await Promise.all(
          favoritesList.map(async fav => {
            try {
              const comedianResult = await client.graphql({
                query: getComedian,
                variables: { id: fav.comedianId },
              });

              if (comedianResult.data.getComedian) {
                return {
                  favorite: fav,
                  comedian: comedianResult.data.getComedian as Comedian,
                };
              }
            } catch (error) {
              console.error(
                `Error fetching comedian ${fav.comedianId}:`,
                error,
              );
            }
            return null;
          }),
        );

        setFavorites(
          favoritesWithComedians.filter(
            (f): f is NonNullable<typeof f> => f !== null,
          ),
        );
      } catch (error) {
        console.error('Error fetching favorite comedians:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchFavorites();
  }, [profile?.id]);

  if (profileLoading || loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Favorite Comedians</h3>
        </div>
        <div className="card-body text-center py-10">
          <div
            className="spinner-border spinner-border-sm text-primary"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Favorite Comedians</h3>
        </div>
        <div className="card-body text-center py-10">
          <KeenIcon icon="user-tick" className="text-6xl text-gray-300 mb-4" />
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            No Favorite Comedians Yet
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Follow comedians to see them here
          </p>
          <Link to="/comedians" className="btn btn-primary btn-sm">
            Browse Comedians
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <h3 className="card-title">Favorite Comedians ({favorites.length})</h3>
        <Link
          to="/comedians"
          className="text-sm text-primary hover:text-primary-active flex items-center gap-1"
        >
          View All
          <KeenIcon icon="arrow-right" className="text-xs" />
        </Link>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favorites.slice(0, 6).map(({ comedian }) => (
            <Link
              key={comedian.id}
              to={`/comedians/${comedian.id}`}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
              title={`${comedian.stageName}${comedian.basedIn ? ` - ${comedian.basedIn}` : ''}`}
            >
              <div className="flex-shrink-0">
                <ComedianAvatar comedian={comedian} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <div
                    className="font-semibold text-gray-900 truncate"
                    title={comedian.stageName}
                  >
                    {comedian.stageName}
                  </div>
                  {comedian.isVerified && (
                    <KeenIcon
                      icon="verify"
                      className="text-success text-sm flex-shrink-0"
                    />
                  )}
                </div>
                {comedian.basedIn && (
                  <div
                    className="text-xs text-gray-600 truncate"
                    title={comedian.basedIn}
                  >
                    {comedian.basedIn}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const ComedianAvatar = ({ comedian }: { comedian: Comedian }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      if (comedian.profileImageKey) {
        try {
          const url = await getPublicUrl(comedian.profileImageKey, 100);
          setImageUrl(url.toString());
        } catch (error) {
          console.error('Error loading image:', error);
        }
      }
    };
    void loadImage();
  }, [comedian.profileImageKey]);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={comedian.stageName}
        className="w-12 h-12 rounded-full object-cover"
      />
    );
  }

  const initials = comedian.stageName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
      {initials}
    </div>
  );
};

export { FavoriteComediansSection };
