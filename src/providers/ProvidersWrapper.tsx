import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AuthProvider } from '@/auth/providers/AWSAmplifyProvider';
import {
  LayoutProvider,
  LoadersProvider,
  MenusProvider,
  SettingsProvider,
  SnackbarProvider,
  TranslationProvider,
} from '@/providers';
import { HelmetProvider } from 'react-helmet-async';
import { Amplify } from 'aws-amplify';
import amplifyconfig from '@/amplifyconfiguration.json';

const queryClient = new QueryClient();

// Initialize Amplify with environment variable overrides for OAuth
const amplifyConfigWithEnv = {
  ...amplifyconfig,
  oauth: {
    ...(amplifyconfig.oauth as any),
    // Use environment variables for redirect URLs (overrides amplifyconfig)
    redirectSignIn:
      import.meta.env.VITE_COGNITO_REDIRECT_SIGNIN ||
      (amplifyconfig.oauth as any)?.redirectSignIn ||
      'http://localhost:5173/auth/callback',
    redirectSignOut:
      import.meta.env.VITE_COGNITO_REDIRECT_SIGNOUT ||
      (amplifyconfig.oauth as any)?.redirectSignOut ||
      'http://localhost:5173/auth/login',
  },
};

Amplify.configure(amplifyConfigWithEnv);

const ProvidersWrapper = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <TranslationProvider>
            <SnackbarProvider>
              <HelmetProvider>
                <LayoutProvider>
                  <LoadersProvider>
                    <MenusProvider>{children}</MenusProvider>
                  </LoadersProvider>
                </LayoutProvider>
              </HelmetProvider>
            </SnackbarProvider>
          </TranslationProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export { ProvidersWrapper };
