import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { KeenIcon } from '@/components';
import { listShowRSVPS, getShow, getVenue } from '@/graphql/queries';
import type { ShowRSVP, Show, Venue } from '@/API';
import { useUserProfile } from '@/hooks';

const client = generateClient({ authMode: 'userPool' });

const SavedShowsSection = () => {
  const { profile, loading: profileLoading } = useUserProfile();
  const [savedShows, setSavedShows] = useState<
    Array<{ rsvp: ShowRSVP; show: Show; venue?: Venue }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedShows = async () => {
      if (!profile?.id) return;

      try {
        setLoading(true);

        const rsvpsResult = await client.graphql({
          query: listShowRSVPS,
          variables: {
            filter: {
              userProfileId: { eq: profile.id },
              or: [
                { status: { eq: 'going' } },
                { status: { eq: 'interested' } },
              ],
            },
          },
        });

        const rsvpsList = rsvpsResult.data.listShowRSVPS.items.filter(
          Boolean,
        ) as ShowRSVP[];

        const showsWithDetails = await Promise.all(
          rsvpsList.map(async rsvp => {
            try {
              const showResult = await client.graphql({
                query: getShow,
                variables: { id: rsvp.showId },
              });

              if (showResult.data.getShow) {
                const show = showResult.data.getShow as Show;

                let venue: Venue | undefined;
                if (show.venueID) {
                  try {
                    const venueResult = await client.graphql({
                      query: getVenue,
                      variables: { id: show.venueID },
                    });
                    if (venueResult.data.getVenue) {
                      venue = venueResult.data.getVenue as Venue;
                    }
                  } catch (error) {
                    console.error('Error fetching venue:', error);
                  }
                }

                return { rsvp, show, venue };
              }
            } catch (error) {
              console.error(`Error fetching show ${rsvp.showId}:`, error);
            }
            return null;
          }),
        );

        const validShows = showsWithDetails.filter(
          (s): s is NonNullable<typeof s> => s !== null,
        );

        // Sort by show date
        validShows.sort((a, b) => {
          const dateA = new Date(a.show.dateTime).getTime();
          const dateB = new Date(b.show.dateTime).getTime();
          return dateA - dateB;
        });

        setSavedShows(validShows);
      } catch (error) {
        console.error('Error fetching saved shows:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchSavedShows();
  }, [profile?.id]);

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch {
      return dateTimeString;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'going') {
      return (
        <span className="badge badge-sm badge-success">
          <KeenIcon icon="check-circle" className="mr-1" />
          Going
        </span>
      );
    }
    if (status === 'interested') {
      return (
        <span className="badge badge-sm badge-warning">
          <KeenIcon icon="star" className="mr-1" />
          Interested
        </span>
      );
    }
    return null;
  };

  if (profileLoading || loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Saved Shows</h3>
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

  if (savedShows.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Saved Shows</h3>
        </div>
        <div className="card-body text-center py-10">
          <KeenIcon icon="heart" className="text-6xl text-gray-300 mb-4" />
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            No Saved Shows Yet
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            RSVP to shows to see them here
          </p>
          <Link to="/shows" className="btn btn-primary btn-sm">
            Browse Shows
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <h3 className="card-title">Saved Shows ({savedShows.length})</h3>
        <Link
          to="/shows"
          className="text-sm text-primary hover:text-primary-active flex items-center gap-1"
        >
          View All
          <KeenIcon icon="arrow-right" className="text-xs" />
        </Link>
      </div>
      <div className="card-body">
        <div className="space-y-3">
          {savedShows.map(({ rsvp, show, venue }) => (
            <Link
              key={rsvp.id}
              to={`/shows/${show.id}`}
              className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex flex-col items-center justify-center text-primary">
                  <div className="text-xs font-medium">
                    {new Date(show.dateTime).toLocaleDateString('en-US', {
                      month: 'short',
                    })}
                  </div>
                  <div className="text-2xl font-bold leading-none">
                    {new Date(show.dateTime).getDate()}
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="font-semibold text-gray-900">
                    {show.title}
                  </div>
                  {rsvp.status && getStatusBadge(rsvp.status)}
                </div>
                {venue && (
                  <div className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                    <KeenIcon icon="geolocation" className="text-gray-400" />
                    {venue.name}
                    {venue.city && ` • ${venue.city}`}
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  {formatDateTime(show.dateTime)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export { SavedShowsSection };
