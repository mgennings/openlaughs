import { useUserProfile } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { KeenIcon } from '@/components/keenicons';
import type { UserRole } from '@/config/constants';

const DASHBOARD_OPTIONS: Array<{
  role: UserRole;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    role: 'fan',
    label: 'Fan View',
    icon: 'heart',
    description: 'Comedy discovery & favorites',
  },
  {
    role: 'comedian',
    label: 'Comedian View',
    icon: 'microphone-2',
    description: 'Performance & bookings',
  },
  {
    role: 'promoter',
    label: 'Promoter View',
    icon: 'chart-line-up',
    description: 'Venue & show management',
  },
  {
    role: 'admin',
    label: 'Admin View',
    icon: 'setting-2',
    description: 'Platform management',
  },
];

const DashboardSwitcher = () => {
  const { role: userRole, loading } = useUserProfile();
  const navigate = useNavigate();

  // Check for dashboard view override (same logic as DefaultPage)
  const viewOverride = sessionStorage.getItem(
    'dashboard-view-override',
  ) as UserRole | null;
  const currentRole = viewOverride || userRole;

  const currentDashboard = DASHBOARD_OPTIONS.find(
    opt => opt.role === currentRole,
  );

  const handleSwitchDashboard = (targetRole: UserRole) => {
    // Store the view preference in sessionStorage so it persists during the session
    sessionStorage.setItem('dashboard-view-override', targetRole);
    // Reload the page to trigger the dashboard switch
    window.location.reload();
  };

  if (loading) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="btn btn-sm btn-light">
          <KeenIcon
            icon={currentDashboard?.icon || 'element-11'}
            className="me-2"
          />
          {currentDashboard?.label || 'Dashboard'}
          <KeenIcon icon="down" className="ms-2" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Switch Dashboard View</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {DASHBOARD_OPTIONS.map(option => (
          <DropdownMenuItem
            key={option.role}
            onClick={() => handleSwitchDashboard(option.role)}
            className={currentRole === option.role ? 'bg-light' : ''}
          >
            <div className="flex items-start gap-3 w-full">
              <div
                className={`flex items-center justify-center size-8 rounded-lg ${
                  currentRole === option.role ? 'bg-primary/10' : 'bg-gray-100'
                }`}
              >
                <KeenIcon
                  icon={option.icon}
                  className={`text-lg ${
                    currentRole === option.role
                      ? 'text-primary'
                      : 'text-gray-600'
                  }`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {option.label}
                  </span>
                  {currentRole === option.role && (
                    <KeenIcon icon="check" className="text-xs text-success" />
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-0.5">
                  {option.description}
                </p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            sessionStorage.removeItem('dashboard-view-override');
            window.location.reload();
          }}
          className="text-sm text-gray-600"
        >
          <KeenIcon icon="arrows-circle" className="me-2" />
          Reset to My Role ({userRole})
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { DashboardSwitcher };
