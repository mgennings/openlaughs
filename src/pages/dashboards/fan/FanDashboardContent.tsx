import { ShowsWidget } from '@/partials/shows';
import { ComediansWidget } from '@/partials/comedians';
import { KeenIcon } from '@/components';
import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import {
  listFavoriteComedians,
  listFavoriteVenues,
  listShowRSVPS,
} from '@/graphql/queries';
import { useUserProfile } from '@/hooks';

const client = generateClient({ authMode: 'userPool' });

const FanDashboardContent = () => {
  const { profile } = useUserProfile();
  const [stats, setStats] = useState({
    comediansFollowing: 0,
    venuesFavorited: 0,
    showsSaved: 0,
    showsAttended: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!profile?.id) {
        setLoadingStats(false);
        return;
      }

      try {
        const [
          comediansResult,
          venuesResult,
          showsSavedResult,
          showsAttendedResult,
        ] = await Promise.all([
          client.graphql({
            query: listFavoriteComedians,
            variables: {
              filter: { userProfileId: { eq: profile.id } },
            },
          }),
          client.graphql({
            query: listFavoriteVenues,
            variables: {
              filter: { userProfileId: { eq: profile.id } },
            },
          }),
          client.graphql({
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
          }),
          client.graphql({
            query: listShowRSVPS,
            variables: {
              filter: {
                userProfileId: { eq: profile.id },
                status: { eq: 'attended' },
              },
            },
          }),
        ]);

        setStats({
          comediansFollowing:
            comediansResult.data.listFavoriteComedians.items.length,
          venuesFavorited: venuesResult.data.listFavoriteVenues.items.length,
          showsSaved: showsSavedResult.data.listShowRSVPS.items.length,
          showsAttended: showsAttendedResult.data.listShowRSVPS.items.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    void fetchStats();
  }, [profile?.id]);

  return (
    <div className="grid gap-5 lg:gap-7.5">
      {/* Welcome Banner */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center gap-5">
            <div className="flex items-center justify-center size-[60px] rounded-lg bg-primary/10">
              <KeenIcon icon="heart" className="text-3xl text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome to OpenLaughs! 🎭
              </h2>
              <p className="text-sm text-gray-600">
                Discover amazing comedy shows, follow your favorite comedians,
                and never miss a laugh.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats - Real Data */}
      <div className="grid lg:grid-cols-4 gap-5 lg:gap-7.5">
        <div className="card">
          <div className="card-body flex items-center gap-4">
            <div className="flex items-center justify-center size-12 rounded-lg bg-success/10">
              <KeenIcon
                icon="calendar-tick"
                className="text-2xl text-success"
              />
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {loadingStats ? '...' : stats.showsAttended}
              </div>
              <div className="text-sm text-gray-600">Shows Attended</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body flex items-center gap-4">
            <div className="flex items-center justify-center size-12 rounded-lg bg-danger/10">
              <KeenIcon icon="user-tick" className="text-2xl text-danger" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {loadingStats ? '...' : stats.comediansFollowing}
              </div>
              <div className="text-sm text-gray-600">Following</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body flex items-center gap-4">
            <div className="flex items-center justify-center size-12 rounded-lg bg-warning/10">
              <KeenIcon icon="star" className="text-2xl text-warning" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {loadingStats ? '...' : stats.venuesFavorited}
              </div>
              <div className="text-sm text-gray-600">Favorite Venues</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body flex items-center gap-4">
            <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10">
              <KeenIcon icon="heart" className="text-2xl text-primary" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {loadingStats ? '...' : stats.showsSaved}
              </div>
              <div className="text-sm text-gray-600">Saved Shows</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Comedians */}
      <div className="grid lg:grid-cols-1 gap-5 lg:gap-7.5">
        <ComediansWidget limit={8} featured={true} />
      </div>

      {/* Upcoming Shows */}
      <div className="grid lg:grid-cols-1 gap-5 lg:gap-7.5">
        <ShowsWidget limit={6} />
      </div>

      {/* Quick Actions */}
      {profile && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="grid md:grid-cols-3 gap-4">
              <a
                href="/comedians"
                className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
              >
                <KeenIcon
                  icon="users"
                  className="text-2xl text-primary mt-0.5"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Browse Comedians
                  </h4>
                  <p className="text-sm text-gray-600">
                    Discover and follow your favorite comedians
                  </p>
                </div>
              </a>

              <a
                href="/shows"
                className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
              >
                <KeenIcon
                  icon="calendar"
                  className="text-2xl text-primary mt-0.5"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Find Shows
                  </h4>
                  <p className="text-sm text-gray-600">
                    RSVP to shows and never miss a show
                  </p>
                </div>
              </a>

              <a
                href="/account/home/user-profile"
                className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
              >
                <KeenIcon
                  icon="profile-circle"
                  className="text-2xl text-primary mt-0.5"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    My Profile
                  </h4>
                  <p className="text-sm text-gray-600">
                    View your favorites and saved shows
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { FanDashboardContent };
