import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listUserProfiles, listShows, listVenues } from '@/graphql/queries';
import { KeenIcon } from '@/components';

const client = generateClient({ authMode: 'userPool' });

interface StatsData {
  totalUsers: number;
  totalShows: number;
  totalVenues: number;
  usersByRole: {
    fans: number;
    comedians: number;
    promoters: number;
    admins: number;
  };
}

const PlatformStats = () => {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalShows: 0,
    totalVenues: 0,
    usersByRole: {
      fans: 0,
      comedians: 0,
      promoters: 0,
      admins: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [usersResult, showsResult, venuesResult] = await Promise.all([
          client.graphql({
            query: (listUserProfiles as string).replace(/__typename/g, ''),
            variables: { limit: 1000 },
          }),
          client.graphql({
            query: (listShows as string).replace(/__typename/g, ''),
            variables: { limit: 1000 },
          }),
          client.graphql({
            query: (listVenues as string).replace(/__typename/g, ''),
            variables: { limit: 1000 },
          }),
        ]);

        // Count users by role
        const users =
          'data' in usersResult
            ? usersResult.data?.listUserProfiles?.items || []
            : [];
        const usersByRole = users.reduce(
          (
            acc: {
              fans: number;
              comedians: number;
              promoters: number;
              admins: number;
            },
            user: any,
          ) => {
            const role = user.role;
            if (role === 'fan') acc.fans++;
            else if (role === 'comedian') acc.comedians++;
            else if (role === 'promoter') acc.promoters++;
            else if (role === 'admin') acc.admins++;
            return acc;
          },
          { fans: 0, comedians: 0, promoters: 0, admins: 0 },
        );

        const shows =
          'data' in showsResult ? showsResult.data?.listShows?.items || [] : [];
        const venues =
          'data' in venuesResult
            ? venuesResult.data?.listVenues?.items || []
            : [];

        setStats({
          totalUsers: users.length,
          totalShows: shows.length,
          totalVenues: venues.length,
          usersByRole,
        });
      } catch (error) {
        console.error('Error fetching platform stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="card h-full">
        <div className="card-header">
          <h3 className="card-title">Platform Statistics</h3>
        </div>
        <div className="card-body flex items-center justify-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-full">
      <div className="card-header">
        <h3 className="card-title">Platform Statistics</h3>
        <div className="text-sm text-gray-600">Real-time platform metrics</div>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-2 gap-5">
          {/* Total Users */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10">
              <KeenIcon icon="people" className="text-2xl text-primary" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {stats.totalUsers}
              </div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
          </div>

          {/* Total Shows */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-12 rounded-lg bg-success/10">
              <KeenIcon icon="calendar" className="text-2xl text-success" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {stats.totalShows}
              </div>
              <div className="text-sm text-gray-600">Total Shows</div>
            </div>
          </div>

          {/* Total Venues */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-12 rounded-lg bg-warning/10">
              <KeenIcon icon="geolocation" className="text-2xl text-warning" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {stats.totalVenues}
              </div>
              <div className="text-sm text-gray-600">Total Venues</div>
            </div>
          </div>

          {/* Comedians Count */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-12 rounded-lg bg-info/10">
              <KeenIcon icon="microphone-2" className="text-2xl text-info" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">
                {stats.usersByRole.comedians}
              </div>
              <div className="text-sm text-gray-600">Comedians</div>
            </div>
          </div>
        </div>

        {/* User Role Breakdown */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">
            Users by Role
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-danger"></div>
                <span className="text-sm text-gray-600">Fans</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {stats.usersByRole.fans}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-info"></div>
                <span className="text-sm text-gray-600">Comedians</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {stats.usersByRole.comedians}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-warning"></div>
                <span className="text-sm text-gray-600">Promoters</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {stats.usersByRole.promoters}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-success"></div>
                <span className="text-sm text-gray-600">Admins</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {stats.usersByRole.admins}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PlatformStats };
