import { ChangeEvent, Fragment, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useAuthContext } from '@/auth';
import { useLanguage } from '@/i18n';
import { toAbsoluteUrl } from '@/utils';
import { DropdownUserLanguages } from './DropdownUserLanguages';
import { useSettings } from '@/providers/SettingsProvider';
import { DefaultTooltip, KeenIcon } from '@/components';
import { useGraphQL } from '@/lib/useGraphQL';
import { listUserProfiles } from '@/graphql/queries';
import type { UserProfile } from '@/API';
import { getPublicUrl } from '@/lib/storage';
import { getInitials, getUserDisplayName } from '@/lib/userDisplay';
import {
  MenuItem,
  MenuLink,
  MenuSub,
  MenuTitle,
  MenuSeparator,
  MenuArrow,
  MenuIcon,
} from '@/components/menu';

interface IDropdownUserProps {
  menuItemRef: any;
}

const DropdownUser = ({ menuItemRef }: IDropdownUserProps) => {
  const { settings, storeSettings } = useSettings();
  const { logout, currentUser } = useAuthContext();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { execute } = useGraphQL();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [profile, setProfile] = useState<UserProfile | undefined>();

  useEffect(() => {
    const init = async () => {
      const email = currentUser?.email;
      if (!email) return;
      const data = await execute<{
        listUserProfiles: { items: (UserProfile | null)[] };
      }>(listUserProfiles, {
        variables: { filter: { email: { eq: email } }, limit: 1 },
      });
      const prof = data.listUserProfiles.items.filter(Boolean)[0] as
        | UserProfile
        | undefined;
      if (prof?.profileImageKey) {
        const url = await getPublicUrl(prof.profileImageKey, 300);
        setAvatarUrl(url.toString());
      }
      setProfile(prof);
    };
    void init();
  }, [currentUser?.email, execute]);

  const handleThemeMode = (event: ChangeEvent<HTMLInputElement>) => {
    const newThemeMode = event.target.checked ? 'dark' : 'light';

    storeSettings({
      themeMode: newThemeMode,
    });
  };

  const buildHeader = () => {
    const userName = getUserDisplayName({
      firstName: profile?.firstName || currentUser?.first_name,
      lastName: profile?.lastName || currentUser?.last_name,
      email: currentUser?.email,
      shortLastName: true,
    });
    const userEmail = currentUser?.email || '';
    const userInitials = getInitials({
      firstName: profile?.firstName || currentUser?.first_name,
      lastName: profile?.lastName || currentUser?.last_name,
      email: currentUser?.email,
    });

    return (
      <div className="flex items-center justify-between px-5 py-1.5 gap-1.5">
        <div className="flex items-center gap-2">
          {avatarUrl ? (
            <img
              className="size-9 rounded-full border-2 border-success"
              src={avatarUrl}
              alt={userName}
            />
          ) : (
            <div className="size-9 rounded-full border-2 border-success bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              {userInitials.toUpperCase()}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Link
              to="/account/home/user-profile"
              className="text-sm text-gray-800 hover:text-primary font-semibold leading-none"
            >
              {userName}
            </Link>
            {userEmail && (
              <a
                href={`mailto:${userEmail}`}
                className="text-xs text-gray-600 hover:text-primary font-medium leading-none"
              >
                {userEmail}
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  const buildMenu = () => {
    return (
      <Fragment>
        <MenuSeparator />
        <div className="flex flex-col">
          <MenuItem>
            <MenuLink path="/public-profile/profiles/default">
              <MenuIcon className="menu-icon">
                <KeenIcon icon="badge" />
              </MenuIcon>
              <MenuTitle>
                <FormattedMessage id="USER.MENU.PUBLIC_PROFILE" />
              </MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink path="/account/home/user-profile">
              <MenuIcon>
                <KeenIcon icon="profile-circle" />
              </MenuIcon>
              <MenuTitle>
                <FormattedMessage id="USER.MENU.MY_PROFILE" />
              </MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuItem
            toggle="dropdown"
            trigger="hover"
            dropdownProps={{
              placement: isRTL() ? 'left-start' : 'right-start',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: isRTL() ? [50, 0] : [-50, 0], // [skid, distance]
                  },
                },
              ],
            }}
          >
            <MenuLink>
              <MenuIcon>
                <KeenIcon icon="setting-2" />
              </MenuIcon>
              <MenuTitle>
                <FormattedMessage id="USER.MENU.MY_ACCOUNT" />
              </MenuTitle>
              <MenuArrow>
                <KeenIcon
                  icon="right"
                  className="text-3xs rtl:transform rtl:rotate-180"
                />
              </MenuArrow>
            </MenuLink>
            <MenuSub className="menu-default light:border-gray-300 w-[200px]] md:w-[220px]">
              <MenuItem>
                <MenuLink path="/account/home/get-started">
                  <MenuIcon>
                    <KeenIcon icon="coffee" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.GET_STARTED" />
                  </MenuTitle>
                </MenuLink>
              </MenuItem>
              <MenuItem>
                <MenuLink path="/account/home/user-profile">
                  <MenuIcon>
                    <KeenIcon icon="some-files" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.MY_PROFILE" />
                  </MenuTitle>
                </MenuLink>
              </MenuItem>
              <MenuItem>
                <MenuLink path="/account/billing/basic">
                  <MenuIcon>
                    <KeenIcon icon="icon" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.BILLING" />
                  </MenuTitle>
                  <DefaultTooltip
                    title={
                      <FormattedMessage id="USER.MENU.PAYMENT_&_SUBSCRIPTION_INFO" />
                    }
                    placement="top"
                    className="max-w-48"
                  >
                    <KeenIcon
                      icon="information-2"
                      className="text-gray-500 text-md"
                    />
                  </DefaultTooltip>
                </MenuLink>
              </MenuItem>
              <MenuItem>
                <MenuLink path="/account/security/overview">
                  <MenuIcon>
                    <KeenIcon icon="medal-star" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.SECURITY" />
                  </MenuTitle>
                </MenuLink>
              </MenuItem>
              <MenuItem>
                <MenuLink path="/account/members/teams">
                  <MenuIcon>
                    <KeenIcon icon="setting" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.MEMBERS_&_ROLES" />
                  </MenuTitle>
                </MenuLink>
              </MenuItem>
              <MenuItem>
                <MenuLink path="/account/integrations">
                  <MenuIcon>
                    <KeenIcon icon="switch" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.INTEGRATIONS" />
                  </MenuTitle>
                </MenuLink>
              </MenuItem>
              <MenuSeparator />
              <MenuItem>
                <MenuLink path="/account/security/overview">
                  <MenuIcon>
                    <KeenIcon icon="shield-tick" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.NOTIFICATIONS" />
                  </MenuTitle>
                  <label className="switch switch-sm">
                    <input
                      name="check"
                      type="checkbox"
                      checked
                      onChange={() => {}}
                      value="1"
                    />
                  </label>
                </MenuLink>
              </MenuItem>
            </MenuSub>
          </MenuItem>
          <MenuItem>
            <MenuLink path="https://devs.keenthemes.com">
              <MenuIcon>
                <KeenIcon icon="message-programming" />
              </MenuIcon>
              <MenuTitle>
                <FormattedMessage id="USER.MENU.DEV_FORUM" />
              </MenuTitle>
            </MenuLink>
          </MenuItem>
          <DropdownUserLanguages menuItemRef={menuItemRef} />
          <MenuSeparator />
        </div>
      </Fragment>
    );
  };

  const buildFooter = () => {
    return (
      <div className="flex flex-col">
        <div className="menu-item mb-0.5">
          <div className="menu-link">
            <span className="menu-icon">
              <KeenIcon icon="moon" />
            </span>
            <span className="menu-title">
              <FormattedMessage id="USER.MENU.DARK_MODE" />
            </span>
            <label className="switch switch-sm">
              <input
                name="theme"
                type="checkbox"
                checked={settings.themeMode === 'dark'}
                onChange={handleThemeMode}
                value="1"
              />
            </label>
          </div>
        </div>

        <div className="menu-item px-4 py-1.5">
          <a
            onClick={async () => {
              await logout();
              navigate('/');
            }}
            className="btn btn-sm btn-light justify-center cursor-pointer"
          >
            <FormattedMessage id="USER.MENU.LOGOUT" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <MenuSub
      className="menu-default light:border-gray-300 w-[200px] md:w-[250px]"
      rootClassName="p-0"
    >
      {buildHeader()}
      {buildMenu()}
      {buildFooter()}
    </MenuSub>
  );
};

export { DropdownUser };
