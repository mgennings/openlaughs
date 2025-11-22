import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { KeenIcon } from '@/components';
import {
  listFavoriteComedians,
  listFavoriteVenues,
  listShowRSVPS,
} from '@/graphql/queries';
import { useUserProfile } from '@/hooks';

const client = generateClient({ authMode: 'userPool' });

const ProfileStats = () => {
  const { profile, loading: profileLoading } = useUserProfile();
  const [stats, setStats] = useState({
    comediansFollowing: 0,
    venuesFavorited: 0,
    showsSaved: 0,
    showsAttended: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!profile?.id) return;

      try {
        setLoading(true);

        // Fetch comedians following
        const comediansResult = await client.graphql({
          query: listFavoriteComedians,
          variables: {
            filter: {
              userProfileId: { eq: profile.id },
            },
          },
        });

        // Fetch venues favorited
        const venuesResult = await client.graphql({
          query: listFavoriteVenues,
          variables: {
            filter: {
              userProfileId: { eq: profile.id },
            },
          },
        });

        // Fetch shows saved (going or interested)
        const showsSavedResult = await client.graphql({
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

        // Fetch shows attended
        const showsAttendedResult = await client.graphql({
          query: listShowRSVPS,
          variables: {
            filter: {
              userProfileId: { eq: profile.id },
              status: { eq: 'attended' },
            },
          },
        });

        setStats({
          comediansFollowing:
            comediansResult.data.listFavoriteComedians.items.length,
          venuesFavorited: venuesResult.data.listFavoriteVenues.items.length,
          showsSaved: showsSavedResult.data.listShowRSVPS.items.length,
          showsAttended: showsAttendedResult.data.listShowRSVPS.items.length,
        });
      } catch (error) {
        console.error('Error fetching profile stats:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchStats();
  }, [profile?.id]);

  if (profileLoading || loading) {
    return (
      <div className="card">
        <div className="card-body text-center py-10">
          <div
            className="spinner-border spinner-border-sm text-primary"
            role="status"
          >
            <span className="sr-only">Loading stats...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Your Comedy Stats</h3>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Shows Attended */}
          <div className="flex flex-col items-center p-4 bg-success/10 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success/20 mb-3">
              <KeenIcon
                icon="calendar-tick"
                className="text-2xl text-success"
              />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.showsAttended}
            </div>
            <div className="text-xs md:text-sm text-gray-600 text-center">
              Shows Attended
            </div>
          </div>

          {/* Comedians Following */}
          <div className="flex flex-col items-center p-4 bg-danger/10 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-danger/20 mb-3">
              <KeenIcon icon="user-tick" className="text-2xl text-danger" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.comediansFollowing}
            </div>
            <div className="text-sm text-gray-600 text-center">Following</div>
          </div>

          {/* Venues Favorited */}
          <div className="flex flex-col items-center p-4 bg-warning/10 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-warning/20 mb-3">
              <KeenIcon icon="star" className="text-2xl text-warning" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.venuesFavorited}
            </div>
            <div className="text-sm text-gray-600 text-center">
              Favorite Venues
            </div>
          </div>

          {/* Shows Saved */}
          <div className="flex flex-col items-center p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-3">
              <KeenIcon icon="heart" className="text-2xl text-primary" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.showsSaved}
            </div>
            <div className="text-sm text-gray-600 text-center">Saved Shows</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProfileStats };
