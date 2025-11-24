import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container } from '@/components/container';
import { KeenIcon, RSVPButton } from '@/components';
import { generateClient } from 'aws-amplify/api';
import { getShow, getVenue, getComedian } from '@/graphql/queries';
import { getPublicUrl } from '@/lib/storage';
import type { Show, Venue, Comedian } from '@/API';

const userClient = generateClient({ authMode: 'userPool' });
const publicClient = generateClient({ authMode: 'apiKey' });

const ShowDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<Show | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [comedians, setComedians] = useState<Comedian[]>([]);
  const [showImageUrl, setShowImageUrl] = useState<string | null>(null);
  const [venueLogoUrl, setVenueLogoUrl] = useState<string | null>(null);
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

                // Fetch venue logo if available
                if (venueData.logoKey) {
                  try {
                    const url = await getPublicUrl(venueData.logoKey);
                    setVenueLogoUrl(url.toString());
                  } catch (err) {
                    console.error('Failed to load venue logo:', err);
                  }
                }
              }
            } catch (venueErr: any) {
              console.error('Failed to load venue:', venueErr);
              // Don't fail the whole page if venue can't be loaded
            }
          }

          // Fetch comedian information
          if (showData.comedianIDs && showData.comedianIDs.length > 0) {
            try {
              const comedianPromises = showData.comedianIDs.map(
                async comedianId => {
                  if (!comedianId) return null;
                  try {
                    let comedianResult: any;
                    try {
                      comedianResult = await userClient.graphql({
                        query: (getComedian as string).replace(
                          /__typename/g,
                          '',
                        ),
                        variables: { id: comedianId },
                      });
                    } catch (e: any) {
                      comedianResult = await publicClient.graphql({
                        query: (getComedian as string).replace(
                          /__typename/g,
                          '',
                        ),
                        variables: { id: comedianId },
                      });
                    }

                    if (
                      'data' in comedianResult &&
                      comedianResult.data?.getComedian
                    ) {
                      return comedianResult.data.getComedian as Comedian;
                    }
                    return null;
                  } catch (err) {
                    console.error(
                      `Failed to load comedian ${comedianId}:`,
                      err,
                    );
                    return null;
                  }
                },
              );

              const comedianResults = await Promise.all(comedianPromises);
              setComedians(
                comedianResults.filter((c): c is Comedian => c !== null),
              );
            } catch (comedianErr: any) {
              console.error('Failed to load comedians:', comedianErr);
              // Don't fail the whole page if comedians can't be loaded
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

  const formatDate = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch {
      return dateTimeString;
    }
  };

  const formatTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch {
      return '';
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
  const venueFirstLetter = venue?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <Container>
      {/* Header with back button */}
      <div className="mb-6">
        <button
          className="btn btn-icon btn-light"
          onClick={() => navigate('/shows')}
        >
          <KeenIcon icon="arrow-left" />
        </button>
      </div>

      {/* Hero Section with Show Title and Key Info */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Show Image or Placeholder */}
          {showImageUrl ? (
            <div className="flex-shrink-0">
              <img
                src={showImageUrl}
                alt={show.title || 'Show image'}
                className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover border-2 border-gray-200"
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-lg bg-primary/10 flex items-center justify-center border-2 border-gray-200">
              <KeenIcon
                icon="calendar"
                className="text-4xl md:text-5xl text-primary"
              />
            </div>
          )}

          {/* Show Title and Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {show.title}
              </h1>
              {isPast && (
                <span className="badge badge-light-warning">Past Show</span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <KeenIcon icon="calendar" className="text-primary mr-1" />
                <div className="flex flex-col">
                  <span className="font-medium">
                    {formatDate(show.dateTime)}
                  </span>
                  <span className="text-xs">{formatTime(show.dateTime)}</span>
                </div>
              </div>
              {venue && (
                <div className="flex items-center gap-2">
                  {venueLogoUrl ? (
                    <img
                      src={venueLogoUrl}
                      alt={`${venue.name} logo`}
                      className="w-6 h-6 rounded-full object-cover"
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        const fallback = document.createElement('div');
                        fallback.className =
                          'w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-xs';
                        fallback.textContent = venueFirstLetter;
                        target.replaceWith(fallback);
                      }}
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-xs">
                      {venueFirstLetter}
                    </div>
                  )}
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
            {show.description && (
              <p className="text-gray-700 line-clamp-2">{show.description}</p>
            )}
            {show.ticketUrl && (
              <div className="mt-4">
                <a
                  href={show.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary inline-flex items-center gap-2"
                >
                  <KeenIcon icon="link" />
                  Get Tickets
                  {show.ticketPrice !== null &&
                    show.ticketPrice !== undefined && (
                      <span className="ml-1">
                        • ${show.ticketPrice.toFixed(2)}
                      </span>
                    )}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Full Show Image */}
          {showImageUrl && (
            <div className="card p-0 overflow-hidden">
              <img
                src={showImageUrl}
                alt={show.title || 'Show image'}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* About This Show */}
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

          {/* Comedians Performing */}
          {comedians && comedians.length > 0 && (
            <div className="card p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Comedians Performing
              </h3>
              <div className="space-y-4">
                {comedians.map(comedian => {
                  const yearsExp = comedian.performingSince
                    ? new Date().getFullYear() - comedian.performingSince
                    : null;

                  return (
                    <Link
                      key={comedian.id}
                      to={`/comedians/${comedian.id}`}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xl flex-shrink-0">
                        {comedian.stageName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg font-semibold text-gray-900">
                            {comedian.stageName}
                          </span>
                          {comedian.isVerified && (
                            <KeenIcon icon="verify" className="text-success" />
                          )}
                          {comedian.isFeatured && (
                            <span className="badge badge-warning badge-sm">
                              Featured
                            </span>
                          )}
                        </div>
                        {comedian.headline && (
                          <p className="text-sm text-gray-600 italic mb-2">
                            "{comedian.headline}"
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          {comedian.basedIn && (
                            <div className="flex items-center gap-1">
                              <KeenIcon icon="geolocation" />
                              <span>{comedian.basedIn}</span>
                            </div>
                          )}
                          {yearsExp !== null && (
                            <div className="flex items-center gap-1">
                              <KeenIcon icon="calendar" />
                              <span>{yearsExp} years</span>
                            </div>
                          )}
                        </div>
                        {comedian.comedyStyles &&
                          comedian.comedyStyles.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {comedian.comedyStyles
                                .slice(0, 3)
                                .map((style, idx) => (
                                  <span
                                    key={idx}
                                    className="badge badge-sm badge-light"
                                  >
                                    {style}
                                  </span>
                                ))}
                            </div>
                          )}
                      </div>
                      <KeenIcon
                        icon="arrow-top-right"
                        className="text-gray-400 flex-shrink-0"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Venue Information */}
          {venue && (
            <div className="card p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Venue Information
              </h3>
              <div className="flex items-start gap-4">
                {venueLogoUrl ? (
                  <img
                    src={venueLogoUrl}
                    alt={`${venue.name} logo`}
                    className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 flex-shrink-0"
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      const fallback = document.createElement('div');
                      fallback.className =
                        'w-20 h-20 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-2xl flex-shrink-0';
                      fallback.textContent = venueFirstLetter;
                      target.replaceWith(fallback);
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-2xl flex-shrink-0">
                    {venueFirstLetter}
                  </div>
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
                  <div className="flex gap-2 mt-3">
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

        {/* Right Column - Show Details Sidebar */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Show Details
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">Date & Time</div>
                <div className="text-gray-900 flex items-center gap-2">
                  <KeenIcon icon="calendar" className="text-primary mr-1" />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {formatDate(show.dateTime)}
                    </span>
                    <span className="text-sm text-gray-600">
                      {formatTime(show.dateTime)}
                    </span>
                  </div>
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

              {show.ticketPrice !== null && show.ticketPrice !== undefined && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Ticket Price</div>
                  <div className="text-gray-900 font-semibold text-lg">
                    ${show.ticketPrice.toFixed(2)}
                  </div>
                </div>
              )}

              {show.ageRestriction && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Age Restriction
                  </div>
                  <div className="text-gray-900">
                    <span className="badge badge-light-info">
                      {show.ageRestriction}
                    </span>
                  </div>
                </div>
              )}

              {show.ticketUrl && (
                <div className="pt-3">
                  <a
                    href={show.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full"
                  >
                    <KeenIcon icon="link" className="me-2" />
                    Get Tickets
                  </a>
                </div>
              )}
            </div>

            {!isPast && (
              <div className="pt-3">
                <div className="grid grid-cols-2 gap-3">
                  {id && <RSVPButton showId={id} variant="button" showCount />}
                  <a
                    href={generateCalendarLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-light w-full"
                  >
                    <KeenIcon icon="calendar" className="me-2" />
                    Add to Calendar
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export { ShowDetailPage };
