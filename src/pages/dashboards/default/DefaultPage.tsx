import { useUserProfile } from '@/hooks';
import { Demo1LightSidebarPage, FanDashboardPage } from '../';
import { KeenIcon } from '@/components';
import type { UserRole } from '@/config/constants';

const DefaultPage = () => {
  const { role: userRole, loading, error } = useUserProfile();

  // Check for dashboard view override (set by DashboardSwitcher)
  const viewOverride = sessionStorage.getItem(
    'dashboard-view-override',
  ) as UserRole | null;
  const role = viewOverride || userRole;

  // Show loading state while fetching user profile
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

  // Show error state if profile fetch failed
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="card max-w-md">
          <div className="card-body text-center">
            <KeenIcon
              icon="information-2"
              className="text-4xl text-danger mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">
              Unable to Load Dashboard
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Route to role-specific dashboard
  switch (role) {
    case 'fan':
      return <FanDashboardPage />;

    case 'comedian':
      // TODO: Create comedian dashboard
      return <FanDashboardPage />; // Fallback to fan for now

    case 'promoter':
      // TODO: Create promoter dashboard
      return <Demo1LightSidebarPage />; // Current business dashboard

    case 'admin':
      return <Demo1LightSidebarPage />; // Current admin dashboard

    default:
      // If no role found, show fan dashboard as default
      return <FanDashboardPage />;
  }
};

export { DefaultPage };
