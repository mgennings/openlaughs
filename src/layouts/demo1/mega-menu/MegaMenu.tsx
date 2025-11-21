import { useResponsive, useUserProfile } from '@/hooks';
import { useEffect, useMemo } from 'react';
import { usePathname } from '@/providers';
import { useDemo1Layout } from '@/layouts/demo1';
import { MegaMenuInner } from '.';
import { useSettings } from '@/providers/SettingsProvider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const MegaMenu = () => {
  const desktopMode = useResponsive('up', 'lg');
  const { pathname, prevPathname } = usePathname();
  const { mobileMegaMenuOpen, setMobileMegaMenuOpen } = useDemo1Layout();
  const { profile } = useUserProfile();
  const { settings } = useSettings();

  const isAdmin = useMemo(() => {
    return profile?.role === 'admin';
  }, [profile?.role]);

  const showPreviewFeatures = isAdmin && settings.previewMode;

  const handleDrawerClose = () => {
    setMobileMegaMenuOpen(false);
  };

  useEffect(() => {
    // Hide drawer on route chnage after menu link click
    if (desktopMode === false && prevPathname !== pathname) {
      handleDrawerClose();
    }
  }, [desktopMode, pathname, prevPathname]);

  // Don't render MegaMenu if preview mode is off
  if (!showPreviewFeatures) {
    return null;
  }

  if (desktopMode) {
    return <MegaMenuInner />;
  } else {
    return (
      <Sheet open={mobileMegaMenuOpen} onOpenChange={handleDrawerClose}>
        <SheetContent
          className="border-0 p-0 w-[225px] scrollable-y-auto"
          forceMount={true}
          side="left"
          close={false}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Mobile Menu</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <MegaMenuInner />
        </SheetContent>
      </Sheet>
    );
  }
};

export { MegaMenu };
