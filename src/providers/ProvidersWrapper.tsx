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

Amplify.configure(amplifyconfig);

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
