import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container } from '@/components/container';
import { KeenIcon } from '@/components';
import { generateClient } from 'aws-amplify/api';
import { getShow, getVenue } from '@/graphql/queries';
import { deleteShow } from '@/graphql/mutations';
import { getPublicUrl } from '@/lib/storage';
import type { Show, Venue } from '@/API';
import { PromoterShowUpdateForm } from './PromoterShowUpdateForm';
import { ModalDeleteShow } from './ModalDeleteShow';

const userClient = generateClient({ authMode: 'userPool' });
const publicClient = generateClient({ authMode: 'apiKey' });

const PromoterShowDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<Show | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [showImageUrl, setShowImageUrl] = useState<string | null>(null);
  const [venueLogoUrl, setVenueLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
        <Link to="/promoter/shows" className="btn btn-primary mt-4">
          Back to Shows
        </Link>
      </Container>
    );
  }

  const handleDeleteShow = async () => {
    if (!show) return;
    setIsDeleting(true);
    try {
      await userClient.graphql({
        query: (deleteShow as string).replace(/__typename/g, ''),
        variables: {
          input: {
            id: show.id,
          },
        },
      });
      // Navigate back to shows list after successful deletion
      navigate('/promoter/shows');
    } catch (err: any) {
      setError(err?.message || 'Failed to delete show');
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isEditing) {
    return (
      <Container>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Edit Show</h2>
          <div className="flex items-center gap-3">
            <button
              className="btn btn-danger"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <KeenIcon icon="trash" className="me-2" />
              Delete Show
            </button>
            <button
              className="btn btn-light"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
        <div className="card p-5">
          <PromoterShowUpdateForm
            showId={show.id}
            onUpdated={() => {
              setIsEditing(false);
              // Reload the page data
              window.location.reload();
            }}
            onError={m => setError(m)}
          />
        </div>
        <ModalDeleteShow
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          showTitle={show.title}
          onConfirm={handleDeleteShow}
          isDeleting={isDeleting}
        />
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
          onClick={() => navigate('/promoter/shows')}
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
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {show.title}
                </h1>
                {isPast && (
                  <span className="badge badge-light-warning">Past Show</span>
                )}
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                <KeenIcon icon="notepad-edit" className="mr-2" />
                Edit Show
              </button>
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

        {/* Right Column - Show Details Sidebar */}
        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Show Details
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">Date & Time</div>
                <div className="text-gray-900 flex items-start gap-2">
                  <KeenIcon icon="calendar" className="text-primary mt-0.5" />
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
                <div className="pt-3 border-t border-gray-200">
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

              {show.createdBy && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Created By</div>
                  <div className="text-gray-900">{show.createdBy}</div>
                </div>
              )}

              <div>
                <div className="text-sm text-gray-600 mb-1">Created</div>
                <div className="text-gray-900">
                  {new Date(show.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">Last Updated</div>
                <div className="text-gray-900">
                  {new Date(show.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export { PromoterShowDetailPage };
