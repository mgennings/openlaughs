import { ShowsWidget } from '@/partials/shows';
import { KeenIcon } from '@/components';

const FanDashboardContent = () => {
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
                Welcome to Austin Comedy! 🎭
              </h2>
              <p className="text-sm text-gray-600">
                Discover amazing comedy shows, follow your favorite comedians,
                and never miss a laugh.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats - Coming Soon */}
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
              <div className="text-2xl font-semibold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Shows Attended</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body flex items-center gap-4">
            <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10">
              <KeenIcon icon="user-tick" className="text-2xl text-primary" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">0</div>
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
              <div className="text-2xl font-semibold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Favorites</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body flex items-center gap-4">
            <div className="flex items-center justify-center size-12 rounded-lg bg-danger/10">
              <KeenIcon icon="heart" className="text-2xl text-danger" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900">0</div>
              <div className="text-sm text-gray-600">Saved Shows</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Shows */}
      <div className="grid lg:grid-cols-1 gap-5 lg:gap-7.5">
        <ShowsWidget limit={6} />
      </div>

      {/* Coming Soon Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Coming Soon</h3>
        </div>
        <div className="card-body">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200">
              <KeenIcon
                icon="profile-circle"
                className="text-xl text-primary mt-0.5"
              />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Follow Comedians
                </h4>
                <p className="text-sm text-gray-600">
                  Stay updated with your favorite comedians and get notified
                  about their shows
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200">
              <KeenIcon
                icon="search-list"
                className="text-xl text-primary mt-0.5"
              />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Discover & Search
                </h4>
                <p className="text-sm text-gray-600">
                  Find shows by comedian, venue, date, or comedy style
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200">
              <KeenIcon icon="star" className="text-xl text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Rate & Review
                </h4>
                <p className="text-sm text-gray-600">
                  Share your experience and help others discover great comedy
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200">
              <KeenIcon
                icon="notification-on"
                className="text-xl text-primary mt-0.5"
              />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  RSVP & Reminders
                </h4>
                <p className="text-sm text-gray-600">
                  Save shows you want to attend and get reminded before they
                  happen
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { FanDashboardContent };
