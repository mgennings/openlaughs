import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/container';
import { KeenIcon } from '@/components';
import { generateClient } from 'aws-amplify/api';
import { listVenues } from '@/graphql/queries';
import type { ListVenuesQuery, Venue } from '@/API';
import { ModalCreateVenue } from './ModalCreateVenue';
import { getPublicUrl } from '@/lib/storage';

const userClient = generateClient({ authMode: 'userPool' });
const publicClient = generateClient({ authMode: 'apiKey' });

const PromoterVenuesPage = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [venueLogoUrls, setVenueLogoUrls] = useState<Record<string, string>>(
    {},
  );

  const fetchVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      let result: any;
      try {
        result = await userClient.graphql({
          query: (listVenues as string).replace(/__typename/g, ''),
          variables: { limit: 100 },
        });
      } catch (e: any) {
        // Retry with API key if userPool is not authorized for read
        result = await publicClient.graphql({
          query: (listVenues as string).replace(/__typename/g, ''),
          variables: { limit: 100 },
        });
      }
      if ('data' in result) {
        const items = (result.data as ListVenuesQuery).listVenues?.items ?? [];
        const validVenues = items.filter(Boolean) as Venue[];
        setVenues(
          validVenues.sort((a, b) =>
            (a.name || '').localeCompare(b.name || ''),
          ),
        );

        // Fetch logo URLs for venues with logoKey
        const logoUrlMap: Record<string, string> = {};
        await Promise.all(
          validVenues.map(async venue => {
            if (venue.logoKey && venue.id) {
              try {
                const url = await getPublicUrl(venue.logoKey, 3600);
                logoUrlMap[venue.id] = url.toString();
              } catch (err) {
                console.error(
                  `Failed to get logo URL for venue ${venue.id}:`,
                  err,
                );
              }
            }
          }),
        );
        setVenueLogoUrls(logoUrlMap);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load venues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">My Venues</h2>
        <div className="flex items-center gap-4">
          <div className="text-gray-600 flex items-center gap-2">
            <KeenIcon icon="home" />
            <span>{venues.length} total</span>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <KeenIcon icon="plus" className="me-2" />
            Create Venue
          </button>
        </div>
      </div>

      <ModalCreateVenue
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreated={() => fetchVenues()}
        onError={message => setError(message)}
      />

      {error && (
        <div className="alert alert-danger mb-6">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <div
            className="spinner-border spinner-border-sm text-primary"
            role="status"
          />
          <span>Loading venues…</span>
        </div>
      ) : venues.length === 0 ? (
        <div className="card p-10 text-center">
          <KeenIcon icon="home" className="text-6xl text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Venues Yet
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Create your first venue to get started
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <KeenIcon icon="plus" className="me-2" />
            Create Venue
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {venues.map(v => (
            <VenueCard
              key={v.id}
              venue={v}
              logoUrl={venueLogoUrls[v.id || '']}
            />
          ))}
        </div>
      )}
    </Container>
  );
};

const VenueCard = ({ venue, logoUrl }: { venue: Venue; logoUrl?: string }) => {
  const [imageError, setImageError] = useState(false);
  const firstLetter = venue.name?.charAt(0).toUpperCase() || 'V';

  return (
    <Link
      to={`/promoter/venues/${venue.id}`}
      className="card p-4 hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-3 mb-1">
        <div className="flex-shrink-0">
          {logoUrl && !imageError ? (
            <img
              src={logoUrl}
              alt={venue.name || 'Venue'}
              className="w-12 h-12 rounded-full border border-gray-200"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base border border-primary/20">
              {firstLetter}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4
              className="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 min-h-[48px]"
              title={venue.name}
            >
              {venue.name}
            </h4>
            {venue.openMic && (
              <span className="badge badge-success text-xxs flex-shrink-0">
                Open Mic
              </span>
            )}
          </div>
          {/* YES I leave code commented out sometimes, don't judge me */}
          {/* {(venue.city || venue.state) && (
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <KeenIcon icon="geolocation" className="text-gray-400" />
              {[venue.city, venue.state].filter(Boolean).join(', ')}
            </div>
          )}
          {venue.address && (
            <div className="text-xs text-gray-500 mt-1">{venue.address}</div>
          )} */}
        </div>
      </div>
      {(venue.city || venue.state) && (
        <div className="text-xs text-gray-600 flex items-center gap-1">
          <KeenIcon icon="geolocation" className="text-gray-400" />
          {[venue.city, venue.state].filter(Boolean).join(', ')}
        </div>
      )}
      {venue.address && (
        <div className="text-xs text-gray-500 mt-1">{venue.address}</div>
      )}

      {venue.bio && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2 mt-2">
          {venue.bio}
        </p>
      )}
      <div className="flex flex-row justify-end items-center mt-auto gap-2 text-sm text-primary">
        <span>View Details</span>
        <KeenIcon icon="arrow-right" className="text-xs" />
      </div>
    </Link>
  );
};

export { PromoterVenuesPage };
