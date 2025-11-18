import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
} from '@/layouts/demo1/toolbar';
import { FanDashboardContent } from './FanDashboardContent';
import { DashboardSwitcher } from '@/components/dashboard-switcher';

const FanDashboardPage = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading
            title="Discover Comedy"
            description="Find shows, follow comedians, and never miss a laugh"
          />
          <ToolbarActions>
            <DashboardSwitcher />
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        <FanDashboardContent />
      </Container>
    </Fragment>
  );
};

export { FanDashboardPage };
