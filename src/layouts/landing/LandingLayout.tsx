import useBodyClasses from '@/hooks/useBodyClasses';
import { LandingLayoutProvider } from './LandingLayoutProvider';
import { Main } from './main/Main';
import { ReactNode } from 'react';

interface ILandingLayoutProps {
  children: ReactNode;
}

const LandingLayout = ({ children }: ILandingLayoutProps) => {
  useBodyClasses(`
    [--tw-page-bg:#ffffff]
    [--tw-page-bg-dark:var(--tw-coal-500)]
    landing-layout 
    bg-[--tw-page-bg]
    dark:bg-[--tw-page-bg-dark]
  `);

  return (
    <LandingLayoutProvider>
      <Main>{children}</Main>
    </LandingLayoutProvider>
  );
};

export { LandingLayout };
