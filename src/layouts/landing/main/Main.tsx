import { ReactElement, ReactNode } from 'react';

interface IMainProps {
  children: ReactNode;
}

const Main = ({ children }: IMainProps): ReactElement => {
  return (
    <div className="d-flex flex-column flex-root">
      <div className="page d-flex flex-row flex-column-fluid">
        <div className="wrapper d-flex flex-column flex-row-fluid">
          <div className="content d-flex flex-column flex-column-fluid">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export { Main };
