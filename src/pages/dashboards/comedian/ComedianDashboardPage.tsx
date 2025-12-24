import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
} from '@/layouts/demo1/toolbar';
import { ComedianDashboardContent } from './ComedianDashboardContent';
import { DashboardSwitcher } from '@/components/dashboard-switcher';

const ComedianDashboardPage = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading
            title="Comedian Dashboard"
            description="Manage your shows, profile, and comedy career"
          />
          <ToolbarActions>
            <DashboardSwitcher />
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        <ComedianDashboardContent />
      </Container>
    </Fragment>
  );
};

export { ComedianDashboardPage };
