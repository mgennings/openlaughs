import { SnackbarContent, CustomContentProps, closeSnackbar } from 'notistack';
import { forwardRef } from 'react';
import { KeenIcon } from '@/components';

export type TSolidSnackbar =
  | 'default'
  | 'dark'
  | 'primary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info';

declare module 'notistack' {
  interface VariantOverrides {
    solid: {
      state: TSolidSnackbar;
    };
  }
}

export interface ISolidSnackbarProps extends CustomContentProps {
  state: TSolidSnackbar;
  message: string;
  id: string | number;
  icon?: string;
}

// Define styles for each state
const rootStyles = {
  dark: 'bg-dark text-dark-inverse',
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary text-primary-inverse',
  success: 'bg-success text-success-inverse',
  danger: 'bg-danger text-danger-inverse',
  warning: 'bg-warning text-warning-inverse',
  info: 'bg-info text-info-inverse',
};

// Icon mapping for each state
const stateIcons: Record<TSolidSnackbar, string> = {
  dark: 'information-2',
  default: 'information-2',
  primary: 'information-2',
  success: 'check-circle',
  danger: 'information-2',
  warning: 'information-2',
  info: 'information-2',
};

const SolidSnackbar = forwardRef<HTMLDivElement, ISolidSnackbarProps>(
  (props, ref) => {
    const { state, icon, message, id } = props;

    // Get the icon and styles based on the state
    const iconName = icon || stateIcons[state] || 'information-2';
    const rootClass = rootStyles[state] || rootStyles['primary'];

    return (
      <SnackbarContent ref={ref} role="alert">
        <div
          className={`flex grow items-center gap-2.5 rounded-lg py-3 px-4 shadow-lg ${rootClass}`}
        >
          {iconName && <KeenIcon icon={iconName} className="text-lg" />}
          <span className="text-sm flex-1">{message}</span>
          <button
            onClick={() => closeSnackbar(id)}
            className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-colors -mr-1"
            aria-label="Dismiss"
          >
            <KeenIcon icon="cross" className="text-sm" />
          </button>
        </div>
      </SnackbarContent>
    );
  },
);

export { SolidSnackbar };
