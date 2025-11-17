import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container } from '@/components/container';
import { KeenIcon } from '@/components';
import { generateClient } from 'aws-amplify/api';
import { getShow, getVenue } from '@/graphql/queries';
import { getPublicUrl } from '@/lib/storage';
import type { Show, Venue } from '@/API';
import { PromoterShowUpdateForm } from './PromoterShowUpdateForm';

const userClient = generateClient({ authMode: 'userPool' });
const publicClient = generateClient({ authMode: 'apiKey' });

const PromoterShowDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<Show | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [showImageUrl, setShowImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
                setVenue(venueResult.data.getVenue as Venue);
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

  if (isEditing) {
    return (
      <Container>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Edit Show</h2>
          <button className="btn btn-light" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
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
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            className="btn btn-icon btn-light"
            onClick={() => navigate('/promoter/shows')}
          >
            <KeenIcon icon="arrow-left" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-900">{show.title}</h2>
        </div>
        <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
          <KeenIcon icon="notepad-edit" className="mr-2" />
          Edit Show
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {showImageUrl && (
            <div className="card p-0 overflow-hidden">
              <img
                src={showImageUrl}
                alt={show.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {show.description && (
            <div className="card p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {show.description}
              </p>
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
                  {venue.address && (
                    <div className="text-sm text-gray-600 mt-1">
                      {venue.address}
                    </div>
                  )}
                  {(venue.city || venue.state) && (
                    <div className="text-sm text-gray-600">
                      {[venue.city, venue.state].filter(Boolean).join(', ')}
                    </div>
                  )}
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
