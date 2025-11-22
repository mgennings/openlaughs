import { Link } from 'react-router-dom';
import { KeenIcon } from '@/components/keenicons';
import { toAbsoluteUrl } from '@/utils';
import { useUserProfile } from '@/hooks';

import { useSettings } from '@/providers/SettingsProvider';
import { useMemo } from 'react';
import { useDemo1Layout } from '../';

const HeaderLogo = () => {
  const { profile } = useUserProfile();
  const { settings } = useSettings();

  const isAdmin = useMemo(() => {
    return profile?.role === 'admin';
  }, [profile?.role]);

  const showPreviewFeatures = isAdmin && settings.previewMode;

  const { setMobileSidebarOpen, setMobileMegaMenuOpen, megaMenuEnabled } =
    useDemo1Layout();

  const handleSidebarOpen = () => {
    setMobileSidebarOpen(true);
  };

  const handleMegaMenuOpen = () => {
    setMobileMegaMenuOpen(true);
  };

  return (
    <div className="flex gap-1 lg:hidden items-center -ms-1">
      <Link to="/" className="shrink-0">
        <img
          src={toAbsoluteUrl('/media/app/OpenLaughs-logo-mobile.png')}
          className="max-h-[35px] w-full"
          alt="mini-logo"
        />
      </Link>

      <div className="flex items-center">
        <button
          type="button"
          className="btn btn-icon btn-light btn-clear btn-sm"
          onClick={handleSidebarOpen}
        >
          <KeenIcon icon="menu" />
        </button>

        {showPreviewFeatures && (
          <button
            type="button"
            className="btn btn-icon btn-light btn-clear btn-sm"
            onClick={handleMegaMenuOpen}
          >
            <KeenIcon icon="burger-menu-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export { HeaderLogo };
