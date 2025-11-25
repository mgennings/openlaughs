import { SolidSnackbar } from '@/components/snackbar';
import {
  SnackbarProvider as CustomSnackbarProvider,
  useSnackbar as useNotistackSnackbar,
} from 'notistack';
import { type PropsWithChildren } from 'react';

const SnackbarProvider = ({ children }: PropsWithChildren) => {
  return (
    <CustomSnackbarProvider
      autoHideDuration={4000}
      maxSnack={3}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      Components={{
        solid: SolidSnackbar,
      }}
      hideIconVariant={false}
    >
      {children}
    </CustomSnackbarProvider>
  );
};

// Custom hook that wraps notistack's useSnackbar with a simpler API
const useSnackbar = () => {
  const { enqueueSnackbar } = useNotistackSnackbar();

  const showSnackbar = (
    message: string,
    variant: 'success' | 'error' | 'warning' | 'info' | 'default' = 'default',
  ) => {
    // Map variant strings to solid snackbar states
    const stateMap: Record<
      'success' | 'error' | 'warning' | 'info' | 'default',
      'success' | 'danger' | 'warning' | 'info' | 'default'
    > = {
      success: 'success',
      error: 'danger',
      warning: 'warning',
      info: 'info',
      default: 'default',
    };

    enqueueSnackbar(message, {
      variant: 'solid',
      state: stateMap[variant],
    });
  };

  return { showSnackbar };
};

export { SnackbarProvider, useSnackbar };
