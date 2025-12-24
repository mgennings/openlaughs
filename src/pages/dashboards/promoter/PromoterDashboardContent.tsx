import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { KeenIcon } from '@/components';
import { useUserProfile } from '@/hooks';
import { listVenues, listShows } from '@/graphql/queries';
import type { Venue, Show } from '@/API';
import { getPublicUrl } from '@/lib/storage';

const client = generateClient({ authMode: 'userPool' });

const PromoterDashboardContent = () => {
  const { profile } = useUserProfile();
  const [myVenues, setMyVenues] = useState<Venue[]>([]);
  const [myShows, setMyShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [venueLogoUrls, setVenueLogoUrls] = useState<Record<string, string>>(
    {},
  );
  const [stats, setStats] = useState({
    totalVenues: 0,
    totalShows: 0,
    upcomingShows: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch shows created by this user first
        const showsResult = await client.graphql({
          query: listShows,
        });

        if ('data' in showsResult && showsResult.data?.listShows?.items) {
          const userShows = showsResult.data.listShows.items.filter(
            (show: Show | null): show is Show =>
              show !== null && show.createdBy === profile.id,
          );

          // Sort by date
          const sortedShows = userShows.sort((a, b) => {
            const dateA = new Date(a.dateTime).getTime();
            const dateB = new Date(b.dateTime).getTime();
            return dateA - dateB;
          });

          setMyShows(sortedShows);

          // Calculate stats
          const now = new Date();
          const upcoming = sortedShows.filter(
            show => new Date(show.dateTime) >= now,
          );

          setStats({
            totalVenues: 0, // Will update after fetching venues
            totalShows: sortedShows.length,
            upcomingShows: upcoming.length,
          });

          // Get unique venue IDs from user's shows
          const venueIds = [
            ...new Set(
              sortedShows.map(show => show.venueID).filter(Boolean) as string[],
            ),
          ];

          if (venueIds.length > 0) {
            // Fetch venues for these shows
            const venuesResult = await client.graphql({
              query: listVenues,
            });

            if (
              'data' in venuesResult &&
              venuesResult.data?.listVenues?.items
            ) {
              const allVenues = venuesResult.data.listVenues.items.filter(
                (venue: Venue | null): venue is Venue =>
                  venue !== null && venueIds.includes(venue.id),
              );

              setMyVenues(allVenues);
              setStats(prev => ({ ...prev, totalVenues: allVenues.length }));

              // Load venue logo URLs
              const logoUrlMap: Record<string, string> = {};
              await Promise.all(
                allVenues.map(async venue => {
                  if (venue.logoKey && venue.id) {
                    try {
                      const url = await getPublicUrl(venue.logoKey);
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
          }
        }
      } catch (error) {
        console.error('Error fetching promoter dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [profile?.id]);

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const upcomingShows = myShows.filter(
    show => new Date(show.dateTime) >= new Date(),
  );

  return (
    <div className="grid gap-5 lg:gap-7.5">
      {/* Welcome Banner */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center gap-5">
            <div className="flex items-center justify-center size-[60px] rounded-lg bg-primary/10">
              <KeenIcon icon="briefcase" className="text-3xl text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome back, Promoter! 🎭
              </h2>
              <p className="text-sm text-gray-600">
                Manage your venues, shows, and comedy events.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        <div className="card">
          <div className="grid grid-cols-2 card-body p-2 md:p-4 gap-2 items-center lg:flex lg:items-center lg:gap-4">
            <div className="col-span-1 flex items-center justify-center size-12 rounded-lg bg-primary/10">
              <KeenIcon icon="home-2" className="text-2xl text-primary" />
            </div>
            <div className="col-span-1 flex items-center lg:block">
              <div className="text-2xl font-semibold text-gray-900">
                {stats.totalVenues}
              </div>
              <div className="hidden lg:block text-sm text-gray-600">
                My Venues
              </div>
            </div>
            <div className="col-span-2 text-center lg:hidden">
              <div className="text-sm text-gray-600">My Venues</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="grid grid-cols-2 card-body p-2 md:p-4 gap-2 items-center lg:flex lg:items-center lg:gap-4">
            <div className="col-span-1 flex items-center justify-center size-12 rounded-lg bg-success/10">
              <KeenIcon icon="calendar" className="text-2xl text-success" />
            </div>
            <div className="col-span-1 flex items-center lg:block">
              <div className="text-2xl font-semibold text-gray-900">
                {stats.totalShows}
              </div>
              <div className="hidden lg:block text-sm text-gray-600">
                Total Shows
              </div>
            </div>
            <div className="col-span-2 text-center lg:hidden">
              <div className="text-sm text-gray-600">Total Shows</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="grid grid-cols-2 card-body p-2 md:p-4 gap-2 items-center lg:flex lg:items-center lg:gap-4">
            <div className="col-span-1 flex items-center justify-center size-12 rounded-lg bg-warning/10">
              <KeenIcon
                icon="calendar-tick"
                className="text-2xl text-warning"
              />
            </div>
            <div className="col-span-1 flex items-center lg:block">
              <div className="text-2xl font-semibold text-gray-900">
                {stats.upcomingShows}
              </div>
              <div className="hidden lg:block text-sm text-gray-600">
                Upcoming
              </div>
            </div>
            <div className="col-span-2 text-center lg:hidden">
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header border-b border-gray-200 bg-gray-50">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div className="card-body">
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to="/promoter/shows"
              className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
            >
              <KeenIcon
                icon="plus-circle"
                className="text-2xl text-primary mt-0.5"
              />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Create Show
                </h4>
                <p className="text-sm text-gray-600">
                  Post a new comedy show or event
                </p>
              </div>
            </Link>

            <Link
              to="/promoter/venues"
              className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
            >
              <KeenIcon
                icon="home-2"
                className="text-2xl text-primary mt-0.5"
              />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Add Venue</h4>
                <p className="text-sm text-gray-600">
                  Add a new venue to the platform
                </p>
              </div>
            </Link>

            <Link
              to="/comedians"
              className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
            >
              <KeenIcon icon="users" className="text-2xl text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Browse Comedians
                </h4>
                <p className="text-sm text-gray-600">
                  Find comedians for your shows
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* My Venues */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="card-title">My Venues ({myVenues.length})</h3>
          {myVenues.length > 0 && (
            <Link
              to="/promoter/venues"
              className="text-sm text-primary hover:text-primary-active flex items-center gap-1"
            >
              View All
              <KeenIcon icon="arrow-right" className="text-xs" />
            </Link>
          )}
        </div>
        <div className="card-body">
          {myVenues.length === 0 ? (
            <div className="text-center py-8">
              <KeenIcon icon="home-2" className="text-5xl text-gray-300 mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                No Venues Yet
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Create your first venue to start posting shows.
              </p>
              <Link to="/promoter/venues" className="btn btn-primary btn-sm">
                <KeenIcon icon="plus" className="me-2" />
                Add Venue
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myVenues.slice(0, 4).map(venue => (
                <Link
                  key={venue.id}
                  to={`/promoter/venues/${venue.id}`}
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                >
                  {venueLogoUrls[venue.id || ''] ? (
                    <img
                      src={venueLogoUrls[venue.id || '']}
                      alt={venue.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <KeenIcon
                        icon="home-2"
                        className="text-xl text-primary"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {venue.name}
                    </h4>
                    {(venue.city || venue.state) && (
                      <p className="text-sm text-gray-600 truncate">
                        {[venue.city, venue.state].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                  <KeenIcon
                    icon="arrow-right"
                    className="text-gray-400 flex-shrink-0"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My Upcoming Shows */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="card-title">
            My Upcoming Shows ({upcomingShows.length})
          </h3>
          {upcomingShows.length > 0 && (
            <Link
              to="/promoter/shows"
              className="text-sm text-primary hover:text-primary-active flex items-center gap-1"
            >
              View All
              <KeenIcon icon="arrow-right" className="text-xs" />
            </Link>
          )}
        </div>
        <div className="card-body">
          {upcomingShows.length === 0 ? (
            <div className="text-center py-8">
              <KeenIcon
                icon="calendar"
                className="text-5xl text-gray-300 mb-4"
              />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                No Upcoming Shows
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Create your first show to get started.
              </p>
              <Link to="/promoter/shows" className="btn btn-primary btn-sm">
                <KeenIcon icon="plus" className="me-2" />
                Create Show
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingShows.slice(0, 5).map(show => {
                const venue = myVenues.find(v => v.id === show.venueID);
                return (
                  <Link
                    key={show.id}
                    to={`/promoter/shows/${show.id}`}
                    className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10">
                        <KeenIcon
                          icon="calendar"
                          className="text-xl text-primary"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {show.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">
                        {formatDateTime(show.dateTime)}
                      </p>
                      {venue && (
                        <p className="text-sm text-gray-500">
                          <KeenIcon icon="home-2" className="me-1" />
                          {venue.name}
                        </p>
                      )}
                    </div>
                    <KeenIcon
                      icon="arrow-right"
                      className="text-gray-400 flex-shrink-0 mt-1"
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { PromoterDashboardContent };
