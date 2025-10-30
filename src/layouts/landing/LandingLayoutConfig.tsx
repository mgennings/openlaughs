import { ReactElement, ReactNode, createContext, useContext } from 'react';

interface ILandingLayoutContext {
  config: {
    aside?: {
      display?: boolean;
    };
    header?: {
      display?: boolean;
    };
    toolbar?: {
      display?: boolean;
    };
    footer?: {
      display?: boolean;
    };
    content?: {
      width?: string;
    };
  };
}

const LandingLayoutContext = createContext<ILandingLayoutContext>({
  config: {
    aside: {
      display: false,
    },
    header: {
      display: false,
    },
    toolbar: {
      display: false,
    },
    footer: {
      display: false,
    },
    content: {
      width: 'fluid',
    },
  },
});

const LandingLayoutConfig = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  const config = {
    aside: {
      display: false,
    },
    header: {
      display: false,
    },
    toolbar: {
      display: false,
    },
    footer: {
      display: false,
    },
    content: {
      width: 'fluid',
    },
  };

  return (
    <LandingLayoutContext.Provider value={{ config }}>
      {children}
    </LandingLayoutContext.Provider>
  );
};

export { LandingLayoutConfig };

export const useLandingLayout = () => useContext(LandingLayoutContext);
