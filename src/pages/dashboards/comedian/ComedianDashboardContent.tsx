import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { KeenIcon } from '@/components';
import { useUserProfile } from '@/hooks';
import { listComedians, listShows } from '@/graphql/queries';
import type { Comedian, Show } from '@/API';
import { getPublicUrl } from '@/lib/storage';

const client = generateClient({ authMode: 'userPool' });

const ComedianDashboardContent = () => {
  const { profile } = useUserProfile();
  const [linkedComedian, setLinkedComedian] = useState<Comedian | null>(null);
  const [myShows, setMyShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalShows: 0,
    upcomingShows: 0,
    pastShows: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch linked comedian
        const comedianResult = await client.graphql({
          query: listComedians,
          variables: {
            filter: {
              userProfileId: { eq: profile.id },
            },
            limit: 1,
          },
        });

        if (
          'data' in comedianResult &&
          comedianResult.data?.listComedians?.items
        ) {
          const items = comedianResult.data.listComedians.items.filter(
            (item: Comedian | null): item is Comedian => item !== null,
          );
          if (items.length > 0) {
            const comedian = items[0];
            setLinkedComedian(comedian);

            // Load profile image
            if (comedian.profileImageKey) {
              try {
                const url = await getPublicUrl(comedian.profileImageKey);
                setProfileImageUrl(url.toString());
              } catch (err) {
                console.error('Error loading comedian image:', err);
              }
            }

            // Fetch shows for this comedian
            const showsResult = await client.graphql({
              query: listShows,
            });

            if ('data' in showsResult && showsResult.data?.listShows?.items) {
              const allShows = showsResult.data.listShows.items.filter(
                (show: Show | null): show is Show =>
                  show !== null &&
                  show.comedianIDs?.includes(comedian.id) === true,
              );

              // Sort by date
              const sortedShows = allShows.sort((a, b) => {
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
              const past = sortedShows.filter(
                show => new Date(show.dateTime) < now,
              );

              setStats({
                totalShows: sortedShows.length,
                upcomingShows: upcoming.length,
                pastShows: past.length,
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching comedian dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [profile?.id]);

  const calculateProfileCompleteness = (comedian: Comedian | null): number => {
    if (!comedian) return 0;

    const fields = [
      comedian.stageName,
      comedian.bio,
      comedian.profileImageKey,
      comedian.firstName,
      comedian.lastName,
      comedian.basedIn,
      comedian.headline,
      comedian.comedyStyles && comedian.comedyStyles.length > 0,
      comedian.website,
      comedian.instagram ||
        comedian.twitter ||
        comedian.tiktok ||
        comedian.youtube,
    ];

    const filledFields = fields.filter(Boolean).length;
    return Math.round((filledFields / fields.length) * 100);
  };

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

  if (!linkedComedian) {
    return (
      <div className="card">
        <div className="card-body text-center py-12">
          <KeenIcon icon="user" className="text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Comedian Profile Linked
          </h3>
          <p className="text-gray-600 mb-6">
            Link your comedian profile to see your dashboard and manage your
            shows.
          </p>
          <Link to="/account/home/user-profile" className="btn btn-primary">
            <KeenIcon icon="plus" className="me-2" />
            Link Comedian Profile
          </Link>
        </div>
      </div>
    );
  }

  const completeness = calculateProfileCompleteness(linkedComedian);
  const upcomingShows = myShows.filter(
    show => new Date(show.dateTime) >= new Date(),
  );

  return (
    <div className="grid gap-5 lg:gap-7.5">
      {/* Welcome Banner */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center gap-5">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={linkedComedian.stageName}
                className="size-[60px] rounded-lg object-cover"
              />
            ) : (
              <div className="flex items-center justify-center size-[60px] rounded-lg bg-primary/10">
                <KeenIcon icon="user" className="text-3xl text-primary" />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-gray-900">
                Welcome back, {linkedComedian.stageName}! 🎤
              </h2>
              <p className="text-sm text-gray-600">
                Manage your shows, update your profile, and grow your comedy
                career.
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
              <KeenIcon icon="calendar" className="text-2xl text-primary" />
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
            <div className="col-span-1 flex items-center justify-center size-12 rounded-lg bg-success/10">
              <KeenIcon
                icon="calendar-tick"
                className="text-2xl text-success"
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

        <div className="card">
          <div className="grid grid-cols-2 card-body p-2 md:p-4 gap-2 items-center lg:flex lg:items-center lg:gap-4">
            <div className="col-span-1 flex items-center justify-center size-12 rounded-lg bg-gray-400/10">
              <KeenIcon
                icon="calendar-check"
                className="text-2xl text-gray-600"
              />
            </div>
            <div className="col-span-1 flex items-center lg:block">
              <div className="text-2xl font-semibold text-gray-900">
                {stats.pastShows}
              </div>
              <div className="hidden lg:block text-sm text-gray-600">
                Past Shows
              </div>
            </div>
            <div className="col-span-2 text-center lg:hidden">
              <div className="text-sm text-gray-600">Past Shows</div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completeness */}
      <div className="card">
        <div className="card-header border-b border-gray-200 bg-gray-50">
          <h3 className="card-title">Profile Completeness</h3>
        </div>
        <div className="card-body">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {completeness}% Complete
                </span>
                {completeness < 100 && (
                  <span className="text-xs text-gray-500">
                    {100 - completeness}% remaining
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all ${
                    completeness >= 80
                      ? 'bg-success'
                      : completeness >= 50
                        ? 'bg-warning'
                        : 'bg-danger'
                  }`}
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </div>
          </div>
          {completeness < 100 && (
            <Link
              to={`/comedians/${linkedComedian.id}`}
              className="btn btn-sm btn-primary"
            >
              <KeenIcon icon="pencil" className="me-2" />
              Complete Profile
            </Link>
          )}
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
              to={`/comedians/${linkedComedian.id}`}
              className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
            >
              <KeenIcon
                icon="pencil"
                className="text-2xl text-primary mt-0.5"
              />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Edit Profile
                </h4>
                <p className="text-sm text-gray-600">
                  Update your bio, photos, and social links
                </p>
              </div>
            </Link>

            <Link
              to={`/comedians/${linkedComedian.id}`}
              className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
            >
              <KeenIcon icon="eye" className="text-2xl text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  View Public Profile
                </h4>
                <p className="text-sm text-gray-600">
                  See how fans see your profile
                </p>
              </div>
            </Link>

            <Link
              to="/shows"
              className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
            >
              <KeenIcon
                icon="calendar"
                className="text-2xl text-primary mt-0.5"
              />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Browse Shows
                </h4>
                <p className="text-sm text-gray-600">
                  Discover upcoming comedy shows
                </p>
              </div>
            </Link>
          </div>
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
              to="/shows"
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
                You don't have any upcoming shows scheduled yet.
              </p>
              <Link to="/shows" className="btn btn-primary btn-sm">
                Browse Shows
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingShows.slice(0, 5).map(show => (
                <Link
                  key={show.id}
                  to={`/shows/${show.id}`}
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
                    {show.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {show.description}
                      </p>
                    )}
                  </div>
                  <KeenIcon
                    icon="arrow-right"
                    className="text-gray-400 flex-shrink-0 mt-1"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { ComedianDashboardContent };
