import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { KeenIcon } from '@/components';
import { listFavoriteVenues, getVenue } from '@/graphql/queries';
import type { FavoriteVenue, Venue } from '@/API';
import { useUserProfile } from '@/hooks';
import { getPublicUrl } from '@/lib/storage';

const client = generateClient({ authMode: 'userPool' });

const FavoriteVenuesSection = () => {
  const { profile, loading: profileLoading } = useUserProfile();
  const [favorites, setFavorites] = useState<
    Array<{ favorite: FavoriteVenue; venue: Venue }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!profile?.id) return;

      try {
        setLoading(true);

        const favoritesResult = await client.graphql({
          query: listFavoriteVenues,
          variables: {
            filter: {
              userProfileId: { eq: profile.id },
            },
          },
        });

        const favoritesList =
          favoritesResult.data.listFavoriteVenues.items.filter(
            Boolean,
          ) as FavoriteVenue[];

        const favoritesWithVenues = await Promise.all(
          favoritesList.map(async fav => {
            try {
              const venueResult = await client.graphql({
                query: getVenue,
                variables: { id: fav.venueId },
              });

              if (venueResult.data.getVenue) {
                return {
                  favorite: fav,
                  venue: venueResult.data.getVenue as Venue,
                };
              }
            } catch (error) {
              console.error(`Error fetching venue ${fav.venueId}:`, error);
            }
            return null;
          }),
        );

        setFavorites(
          favoritesWithVenues.filter(
            (f): f is NonNullable<typeof f> => f !== null,
          ),
        );
      } catch (error) {
        console.error('Error fetching favorite venues:', error);
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
          <h3 className="card-title">Favorite Venues</h3>
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
          <h3 className="card-title">Favorite Venues</h3>
        </div>
        <div className="card-body text-center py-10">
          <KeenIcon icon="star" className="text-6xl text-gray-300 mb-4" />
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            No Favorite Venues Yet
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Favorite venues to see them here
          </p>
          <Link to="/promoter/venues" className="btn btn-warning btn-sm">
            Browse Venues
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <h3 className="card-title">Favorite Venues ({favorites.length})</h3>
        <Link
          to="/promoter/venues"
          className="text-sm text-primary hover:text-primary-active flex items-center gap-1"
        >
          View All
          <KeenIcon icon="arrow-right" className="text-xs" />
        </Link>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favorites.slice(0, 4).map(({ venue }) => (
            <Link
              key={venue.id}
              to={`/promoter/venues/${venue.id}`}
              className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-warning hover:shadow-sm transition-all"
            >
              <div className="flex-shrink-0">
                <VenueLogo venue={venue} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 mb-1">
                  {venue.name}
                </div>
                {(venue.city || venue.state) && (
                  <div className="text-xs text-gray-600 flex items-center gap-1 mb-2">
                    <KeenIcon icon="geolocation" className="text-gray-400" />
                    {[venue.city, venue.state].filter(Boolean).join(', ')}
                  </div>
                )}
                {venue.openMic && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-success/10 text-success text-xs rounded">
                    <KeenIcon icon="microphone-2" />
                    Open Mic
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

const VenueLogo = ({ venue }: { venue: Venue }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadLogo = async () => {
      if (venue.logoKey) {
        try {
          const url = await getPublicUrl(venue.logoKey, 100);
          setLogoUrl(url.toString());
        } catch (error) {
          console.error('Error loading logo:', error);
          setImageError(true);
        }
      }
    };
    void loadLogo();
  }, [venue.logoKey]);

  const firstLetter = venue.name.charAt(0).toUpperCase();

  if (logoUrl && !imageError) {
    return (
      <img
        src={logoUrl}
        alt={venue.name}
        className="w-12 h-12 rounded-lg object-cover"
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center text-warning font-bold text-xl">
      {firstLetter}
    </div>
  );
};

export { FavoriteVenuesSection };
