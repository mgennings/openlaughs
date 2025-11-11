import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container } from '@/components/container';
import { KeenIcon } from '@/components';
import { generateClient } from 'aws-amplify/api';
import { getVenue } from '@/graphql/queries';
import { getPublicUrl } from '@/lib/storage';
import type { GetVenueQuery, Venue } from '@/API';
import { PromoterVenueUpdateForm } from './PromoterVenueUpdateForm';

const userClient = generateClient({ authMode: 'userPool' });
const publicClient = generateClient({ authMode: 'apiKey' });

const PromoterVenueDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [venueImageUrls, setVenueImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('Venue ID is required');
      setLoading(false);
      return;
    }

    const fetchVenue = async () => {
      setLoading(true);
      setError(null);
      try {
        let result: any;
        try {
          result = await userClient.graphql({
            query: (getVenue as string).replace(/__typename/g, ''),
            variables: { id },
          });
        } catch (e: any) {
          // Retry with API key if userPool is not authorized for read
          result = await publicClient.graphql({
            query: (getVenue as string).replace(/__typename/g, ''),
            variables: { id },
          });
        }

        if ('data' in result && result.data?.getVenue) {
          const venueData = result.data.getVenue as Venue;
          setVenue(venueData);

          // Load venue images
          if (venueData.venueImageKeys && venueData.venueImageKeys.length > 0) {
            const validKeys = venueData.venueImageKeys.filter(
              (key): key is string => key !== null && key !== undefined,
            );
            if (validKeys.length > 0) {
              const urls = await Promise.all(
                validKeys.map(key => getPublicUrl(key)),
              );
              setVenueImageUrls(urls.map(url => url.toString()));
            }
          }
        } else {
          setError('Venue not found');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load venue');
      } finally {
        setLoading(false);
      }
    };

    void fetchVenue();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center p-8">
          <div
            className="spinner-border spinner-border-sm text-primary"
            role="status"
          />
          <span className="ml-2 text-gray-600">Loading venue...</span>
        </div>
      </Container>
    );
  }

  if (error || !venue) {
    return (
      <Container>
        <div className="alert alert-danger">
          <span>{error || 'Venue not found'}</span>
        </div>
        <Link to="/promoter/venues" className="btn btn-primary mt-4">
          Back to Venues
        </Link>
      </Container>
    );
  }

  if (isEditing) {
    return (
      <Container>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Edit Venue</h2>
          <button className="btn btn-light" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
        <div className="card p-5">
          <PromoterVenueUpdateForm
            venueId={venue.id}
            onUpdated={() => {
              setIsEditing(false);
              // Reload the page data
              window.location.reload();
            }}
            onError={m => setError(m)}
          />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            className="btn btn-icon btn-light"
            onClick={() => navigate('/promoter/venues')}
          >
            <KeenIcon icon="arrow-left" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-900">{venue.name}</h2>
        </div>
        <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
          <KeenIcon icon="notepad-edit" className="mr-2" />
          Edit Venue
        </button>
      </div>

      {venueImageUrls.length > 0 && (
        <div className="card p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {venueImageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`${venue.name} - Image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {venue.bio && (
            <div className="card p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Bio</h3>
              <p className="text-gray-700 whitespace-pre-line">{venue.bio}</p>
            </div>
          )}

          {venue.description && (
            <div className="card p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {venue.description}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Venue Details
            </h3>
            <div className="space-y-3">
              {venue.address && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Address</div>
                  <div className="text-gray-900">{venue.address}</div>
                </div>
              )}
              {(venue.city || venue.state || venue.postalCode) && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Location</div>
                  <div className="text-gray-900">
                    {[venue.city, venue.state, venue.postalCode]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                </div>
              )}
              {venue.country && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Country</div>
                  <div className="text-gray-900">{venue.country}</div>
                </div>
              )}
              {venue.phone && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Phone</div>
                  <a
                    href={`tel:${venue.phone}`}
                    className="text-primary hover:underline"
                  >
                    {venue.phone}
                  </a>
                </div>
              )}
              {venue.email && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Email</div>
                  <a
                    href={`mailto:${venue.email}`}
                    className="text-primary hover:underline"
                  >
                    {venue.email}
                  </a>
                </div>
              )}
              {venue.website && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Website</div>
                  <a
                    href={venue.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {venue.website}
                  </a>
                </div>
              )}
              {venue.googleReviewsLink && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Google Reviews
                  </div>
                  <a
                    href={venue.googleReviewsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    View Reviews
                    <KeenIcon icon="arrow-top-right" className="text-xs" />
                  </a>
                </div>
              )}
              <div>
                <div className="text-sm text-gray-600 mb-1">Type</div>
                {venue.openMic ? (
                  <span className="badge badge-success">Open Mic</span>
                ) : (
                  <span className="badge badge-light">Venue</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export { PromoterVenueDetailPage };
