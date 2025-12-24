import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
} from '@/layouts/demo1/toolbar';
import { PromoterDashboardContent } from './PromoterDashboardContent';
import { DashboardSwitcher } from '@/components/dashboard-switcher';

const PromoterDashboardPage = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading
            title="Promoter Dashboard"
            description="Manage your venues, shows, and comedy events"
          />
          <ToolbarActions>
            <DashboardSwitcher />
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        <PromoterDashboardContent />
      </Container>
    </Fragment>
  );
};

export { PromoterDashboardPage };
