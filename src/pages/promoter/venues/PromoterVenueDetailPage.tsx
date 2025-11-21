import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container } from '@/components/container';
import { KeenIcon, FavoriteVenueButton } from '@/components';
import { generateClient } from 'aws-amplify/api';
import { getVenue } from '@/graphql/queries';
import { getPublicUrl } from '@/lib/storage';
import { type GetVenueQuery, type Venue } from '@/API';
import { PromoterVenueUpdateForm } from './PromoterVenueUpdateForm';
import { cleanPhoneNumber, formatPhoneForDisplay } from '@/utils/validation';

const userClient = generateClient({ authMode: 'userPool' });
const publicClient = generateClient({ authMode: 'apiKey' });

const PromoterVenueDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [venueImageUrls, setVenueImageUrls] = useState<string[]>([]);
  const [venueLogoUrl, setVenueLogoUrl] = useState<string | null>(null);
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

          // Load venue logo
          if (venueData.logoKey) {
            try {
              const logoUrl = await getPublicUrl(venueData.logoKey);
              setVenueLogoUrl(logoUrl.toString());
            } catch (err) {
              console.error('Failed to load logo URL:', err);
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

  // Get first letter for logo fallback
  const firstLetter = venue.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <Container>
      {/* Header with back button and edit */}
      <div className="flex items-center justify-between mb-6">
        <button
          className="btn btn-icon btn-light"
          onClick={() => navigate('/promoter/venues')}
        >
          <KeenIcon icon="arrow-left" />
        </button>
        <div className="flex items-center gap-2">
          {id && <FavoriteVenueButton venueId={id} showCount />}
          <button
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            <KeenIcon icon="notepad-edit" className="mr-2" />
            Edit Venue
          </button>
        </div>
      </div>

      {/* Hero Section with Logo and Venue Name */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            {venueLogoUrl ? (
              <img
                src={venueLogoUrl}
                alt={`${venue.name} logo`}
                className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover border-2 border-gray-200"
                onError={e => {
                  // Fallback to letter circle if image fails
                  const target = e.target as HTMLImageElement;
                  const fallback = document.createElement('div');
                  fallback.className =
                    'w-24 h-24 md:w-32 md:h-32 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-3xl md:text-4xl';
                  fallback.textContent = firstLetter;
                  target.replaceWith(fallback);
                }}
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-3xl md:text-4xl">
                {firstLetter}
              </div>
            )}
          </div>

          {/* Venue Name and Quick Info */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {venue.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {venue.city && venue.state && (
                <div className="flex items-center gap-1">
                  <KeenIcon icon="geolocation" className="text-primary" />
                  <span>
                    {venue.city}, {venue.state}
                  </span>
                </div>
              )}
              {venue.openMic ? (
                <span className="badge badge-success">Open Mic</span>
              ) : (
                <span className="badge badge-light">Venue</span>
              )}
              {venue.phone && (
                <a
                  href={`tel:${cleanPhoneNumber(venue.phone)}`}
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <KeenIcon icon="phone" />
                  <span>{formatPhoneForDisplay(venue.phone)}</span>
                </a>
              )}
            </div>
            {venue.bio && (
              <p className="text-gray-700 mt-3 line-clamp-2">{venue.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Image Gallery */}
      {venueImageUrls.length > 0 && (
        <div className="mb-6">
          {venueImageUrls.length === 1 ? (
            <div className="card p-0 overflow-hidden">
              <img
                src={venueImageUrls[0]}
                alt={`${venue.name}`}
                className="w-full h-96 object-cover"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {venueImageUrls.map((url, index) => (
                <div key={index} className="card p-0 overflow-hidden">
                  <img
                    src={url}
                    alt={`${venue.name} - Image ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Bio and Description */}
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

        {/* Right Column - Venue Details */}
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
                    href={`tel:${cleanPhoneNumber(venue.phone)}`}
                    className="text-primary hover:underline"
                  >
                    {formatPhoneForDisplay(venue.phone)}
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
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export { PromoterVenueDetailPage };
