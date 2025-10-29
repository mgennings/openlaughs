import { ReactElement, ReactNode } from 'react';
import { LandingLayoutConfig } from './LandingLayoutConfig';

interface ILandingLayoutProviderProps {
  children: ReactNode;
}

const LandingLayoutProvider = ({
  children,
}: ILandingLayoutProviderProps): ReactElement => {
  return <LandingLayoutConfig>{children}</LandingLayoutConfig>;
};

export { LandingLayoutProvider };
