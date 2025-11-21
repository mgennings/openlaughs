import { Fragment, useMemo } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/toolbar';
import { PageNavbar } from '@/pages/account';

import { AccountUserProfileContent } from '.';
import { useLayout } from '@/providers';
import { useUserProfile } from '@/hooks';
import { useSettings } from '@/providers/SettingsProvider';

const AccountUserProfilePage = () => {
  const { currentLayout } = useLayout();
  const { profile } = useUserProfile();
  const { settings } = useSettings();

  const isAdmin = useMemo(() => {
    return profile?.role === 'admin';
  }, [profile?.role]);

  const showPreviewFeatures = isAdmin && settings.previewMode;

  return (
    <Fragment>
      <PageNavbar />

      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                View and manage your profile information
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              {showPreviewFeatures && (
                <>
                  <a
                    href="/public-profile/profiles/default"
                    className="btn btn-sm btn-light"
                  >
                    Public Profile
                  </a>
                  <a
                    href="#personal-info-card"
                    className="btn btn-sm btn-primary"
                  >
                    Account Settings
                  </a>
                </>
              )}
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <AccountUserProfileContent />
      </Container>
    </Fragment>
  );
};

export { AccountUserProfilePage };
