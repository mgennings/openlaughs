import { Fragment, useState } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
} from '@/layouts/demo1/toolbar';
import { Demo1LightSidebarContent } from '../light-sidebar';
import { DashboardSwitcher } from '@/components/dashboard-switcher';

const Demo1DarkSidebarPage = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading
            title="Dashboard"
            description="All your comedy shows, venues, and performers at a glance"
          />
          <ToolbarActions>
            <DashboardSwitcher />
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        <Demo1LightSidebarContent />
      </Container>
    </Fragment>
  );
};

export { Demo1DarkSidebarPage };
