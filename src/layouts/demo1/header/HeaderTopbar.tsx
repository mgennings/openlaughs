import { useEffect, useRef, useState } from 'react';
import { KeenIcon } from '@/components/keenicons';
import { toAbsoluteUrl } from '@/utils';
import { Menu, MenuItem, MenuToggle } from '@/components';
import { DropdownUser } from '@/partials/dropdowns/user';
import { DropdownNotifications } from '@/partials/dropdowns/notifications';
import { DropdownApps } from '@/partials/dropdowns/apps';
import { DropdownChat } from '@/partials/dropdowns/chat';
import { ModalSearch } from '@/partials/modals/search/ModalSearch';
import { useLanguage } from '@/i18n';
import { useAuthContext } from '@/auth';
import { useGraphQL } from '@/lib/useGraphQL';
import { listUserProfiles } from '@/graphql/queries';
import type { UserProfile } from '@/API';
import { getPublicUrl } from '@/lib/storage';
import { getInitials } from '@/lib/userDisplay';

const HeaderTopbar = () => {
  const { isRTL } = useLanguage();
  const itemChatRef = useRef<any>(null);
  const itemAppsRef = useRef<any>(null);
  const itemUserRef = useRef<any>(null);
  const itemNotificationsRef = useRef<any>(null);
  const { currentUser } = useAuthContext();
  const { execute } = useGraphQL();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [initials, setInitials] = useState<string>('U');

  const handleShow = () => {
    window.dispatchEvent(new Event('resize'));
  };

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  useEffect(() => {
    const init = async () => {
      const email = currentUser?.email;
      const first = currentUser?.first_name;
      const last = currentUser?.last_name;
      setInitials(getInitials({ firstName: first, lastName: last, email }));
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
    };
    void init();
  }, [
    currentUser?.email,
    currentUser?.first_name,
    currentUser?.last_name,
    execute,
  ]);
  const handleOpen = () => setSearchModalOpen(true);
  const handleClose = () => {
    setSearchModalOpen(false);
  };

  return (
    <div className="flex items-center gap-2 lg:gap-3.5">
      <button
        onClick={handleOpen}
        className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary text-gray-500"
      >
        <KeenIcon icon="magnifier" />
      </button>
      <ModalSearch open={searchModalOpen} onOpenChange={handleClose} />

      <Menu>
        <MenuItem
          ref={itemChatRef}
          onShow={handleShow}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [-170, 10] : [170, 10],
                },
              },
            ],
          }}
        >
          <MenuToggle className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="messages" />
          </MenuToggle>

          {DropdownChat({ menuTtemRef: itemChatRef })}
        </MenuItem>
      </Menu>

      <Menu>
        <MenuItem
          ref={itemAppsRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [-10, 10] : [10, 10],
                },
              },
            ],
          }}
        >
          <MenuToggle className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="element-11" />
          </MenuToggle>

          {DropdownApps()}
        </MenuItem>
      </Menu>

      <Menu>
        <MenuItem
          ref={itemNotificationsRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [-70, 10] : [70, 10], // [skid, distance]
                },
              },
            ],
          }}
        >
          <MenuToggle className="btn btn-icon btn-icon-lg relative cursor-pointer size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="notification-status" />
          </MenuToggle>
          {DropdownNotifications({ menuTtemRef: itemNotificationsRef })}
        </MenuItem>
      </Menu>

      <Menu>
        <MenuItem
          ref={itemUserRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [-20, 10] : [20, 10], // [skid, distance]
                },
              },
            ],
          }}
        >
          <MenuToggle className="btn btn-icon rounded-full">
            {avatarUrl ? (
              <img
                className="size-9 rounded-full border-2 border-success shrink-0"
                src={avatarUrl}
                alt="avatar"
              />
            ) : (
              <div className="size-9 rounded-full border-2 border-success bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                {initials}
              </div>
            )}
          </MenuToggle>
          {DropdownUser({ menuItemRef: itemUserRef })}
        </MenuItem>
      </Menu>
    </div>
  );
};

export { HeaderTopbar };
