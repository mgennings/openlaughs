import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { ScreenLoader } from '@/components/loaders';
import { useAuthContext } from '@/auth';
import { LandingLayout } from '@/layouts/landing/LandingLayout';
import { LandingPage } from '@/pages/landing/LandingPage';

const RootRoute = (): ReactElement => {
  const { auth, loading } = useAuthContext();

  if (loading) {
    return <ScreenLoader />;
  }

  // If authenticated, redirect to dashboard
  if (auth) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated, show landing page
  return (
    <LandingLayout>
      <LandingPage />
    </LandingLayout>
  );
};

export { RootRoute };
