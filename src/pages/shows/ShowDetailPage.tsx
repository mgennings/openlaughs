import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container } from '@/components/container';
import { KeenIcon } from '@/components';
import { generateClient } from 'aws-amplify/api';
import { getShow, getVenue } from '@/graphql/queries';
import { getPublicUrl } from '@/lib/storage';
import type { Show, Venue } from '@/API';

const userClient = generateClient({ authMode: 'userPool' });
const publicClient = generateClient({ authMode: 'apiKey' });

const ShowDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<Show | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [showImageUrl, setShowImageUrl] = useState<string | null>(null);
  const [venueImageUrl, setVenueImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Show ID is required');
      setLoading(false);
      return;
    }

    const fetchShow = async () => {
      setLoading(true);
      setError(null);
      try {
        let result: any;
        try {
          result = await userClient.graphql({
            query: (getShow as string).replace(/__typename/g, ''),
            variables: { id },
          });
        } catch (e: any) {
          // Retry with API key if userPool is not authorized for read
          result = await publicClient.graphql({
            query: (getShow as string).replace(/__typename/g, ''),
            variables: { id },
          });
        }

        if ('data' in result && result.data?.getShow) {
          const showData = result.data.getShow as Show;
          setShow(showData);

          // Fetch show image if available
          if (showData.showImageKey) {
            try {
              const url = await getPublicUrl(showData.showImageKey);
              setShowImageUrl(url.toString());
            } catch (err) {
              console.error('Failed to load show image:', err);
            }
          }

          // Fetch venue information
          if (showData.venueID) {
            try {
              let venueResult: any;
              try {
                venueResult = await userClient.graphql({
                  query: (getVenue as string).replace(/__typename/g, ''),
                  variables: { id: showData.venueID },
                });
              } catch (e: any) {
                venueResult = await publicClient.graphql({
                  query: (getVenue as string).replace(/__typename/g, ''),
                  variables: { id: showData.venueID },
                });
              }

              if ('data' in venueResult && venueResult.data?.getVenue) {
                const venueData = venueResult.data.getVenue as Venue;
                setVenue(venueData);

                // Fetch venue image if available
                if (venueData.venueImageKeys && venueData.venueImageKeys.length > 0) {
                  try {
                    const url = await getPublicUrl(venueData.venueImageKeys[0]);
                    setVenueImageUrl(url.toString());
                  } catch (err) {
                    console.error('Failed to load venue image:', err);
                  }
                }
              }
            } catch (venueErr: any) {
              console.error('Failed to load venue:', venueErr);
              // Don't fail the whole page if venue can't be loaded
            }
          }
        } else {
          setError('Show not found');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load show');
      } finally {
        setLoading(false);
      }
    };

    void fetchShow();
  }, [id]);

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch {
      return dateTimeString;
    }
  };

  const generateCalendarLink = () => {
    if (!show) return '';
    const startDate = new Date(show.dateTime);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: show.title || 'Comedy Show',
      dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
      details: show.description || '',
      location: venue
        ? [venue.name, venue.address, venue.city, venue.state]
            .filter(Boolean)
            .join(', ')
        : '',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center p-8">
          <div
            className="spinner-border spinner-border-sm text-primary"
            role="status"
          />
          <span className="ml-2 text-gray-600">Loading show...</span>
        </div>
      </Container>
    );
  }

  if (error || !show) {
    return (
      <Container>
        <div className="alert alert-danger">
          <span>{error || 'Show not found'}</span>
        </div>
        <Link to="/shows" className="btn btn-primary mt-4">
          Back to Shows
        </Link>
      </Container>
    );
  }

  const isPast = new Date(show.dateTime).getTime() < new Date().getTime();

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            className="btn btn-icon btn-light"
            onClick={() => navigate('/shows')}
          >
            <KeenIcon icon="arrow-left" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-900">
            {show.title}
          </h2>
          {isPast && (
            <span className="badge badge-light-warning">Past Show</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {showImageUrl && (
            <div className="card p-0 overflow-hidden">
              <img
                src={showImageUrl}
                alt={show.title || 'Show image'}
                className="w-full h-auto"
              />
            </div>
          )}

          {show.description && (
            <div className="card p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                About This Show
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {show.description}
              </p>
            </div>
          )}

          {venue && (
            <div className="card p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Venue Information
              </h3>
              <div className="flex items-start gap-4">
                {venueImageUrl && (
                  <img
                    src={venueImageUrl}
                    alt={venue.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <Link
                    to={`/promoter/venues/${venue.id}`}
                    className="text-xl font-semibold text-primary hover:underline flex items-center gap-2 mb-2"
                  >
                    {venue.name}
                    <KeenIcon icon="arrow-top-right" className="text-xs" />
                  </Link>
                  {venue.address && (
                    <div className="text-gray-600 mb-1 flex items-center gap-2">
                      <KeenIcon icon="geolocation" className="text-primary" />
                      {venue.address}
                    </div>
                  )}
                  {(venue.city || venue.state) && (
                    <div className="text-gray-600 mb-2">
                      {[venue.city, venue.state, venue.postalCode]
                        .filter(Boolean)
                        .join(', ')}
                    </div>
                  )}
                  {venue.description && (
                    <p className="text-gray-700 text-sm mt-2">
                      {venue.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {venue.website && (
                      <a
                        href={venue.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-light"
                      >
                        <KeenIcon icon="link" className="me-2" />
                        Website
                      </a>
                    )}
                    {venue.googleReviewsLink && (
                      <a
                        href={venue.googleReviewsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-light"
                      >
                        <KeenIcon icon="star" className="me-2" />
                        Reviews
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Show Details
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">Date & Time</div>
                <div className="text-gray-900 flex items-center gap-2">
                  <KeenIcon icon="calendar" className="text-primary" />
                  {formatDateTime(show.dateTime)}
                </div>
              </div>

              {venue && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Venue</div>
                  <Link
                    to={`/promoter/venues/${venue.id}`}
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {venue.name}
                    <KeenIcon icon="arrow-top-right" className="text-xs" />
                  </Link>
                </div>
              )}
            </div>

            {!isPast && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <a
                  href={generateCalendarLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full"
                >
                  <KeenIcon icon="calendar" className="me-2" />
                  Add to Calendar
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export { ShowDetailPage };

