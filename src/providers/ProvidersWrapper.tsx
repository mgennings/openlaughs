import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AuthProvider } from '@/auth/providers/AWSAmplifyProvider';
import {
  LayoutProvider,
  LoadersProvider,
  MenusProvider,
  SettingsProvider,
  // eslint-disable-next-line no-unused-vars
  SnackbarProvider,
  TranslationProvider,
} from '@/providers';
import { HelmetProvider } from 'react-helmet-async';
import { Amplify } from 'aws-amplify';
import amplifyconfig from '@/amplifyconfiguration.json';

const queryClient = new QueryClient();

// Initialize Amplify
Amplify.configure(amplifyconfig);

const ProvidersWrapper = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <TranslationProvider>
            <HelmetProvider>
              <LayoutProvider>
                <LoadersProvider>
                  <MenusProvider>{children}</MenusProvider>
                </LoadersProvider>
              </LayoutProvider>
            </HelmetProvider>
          </TranslationProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export { ProvidersWrapper };
