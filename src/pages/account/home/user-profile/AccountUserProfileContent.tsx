import { useMemo } from 'react';
import { RecentUploads } from '@/pages/public-profile/profiles/default';
import {
  BasicSettings,
  CalendarAccounts,
  CommunityBadges,
  Connections,
  PersonalInfo,
  StartNow,
  Work,
  ProfileStats,
  FavoriteComediansSection,
  FavoriteVenuesSection,
  SavedShowsSection,
  ComedianProfile,
} from './blocks';
import { useUserProfile } from '@/hooks';
import { useSettings } from '@/providers/SettingsProvider';

const AccountUserProfileContent = () => {
  const { profile } = useUserProfile();
  const { settings } = useSettings();

  const isAdmin = useMemo(() => {
    return profile?.role === 'admin';
  }, [profile?.role]);

  const showPreviewFeatures = isAdmin && settings.previewMode;

  return (
    <div className="grid gap-5 lg:gap-7.5">
      {/* Stats at the top - full width */}
      <ProfileStats />

      {/* Two column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-7.5">
        <div className="col-span-1">
          <div className="grid gap-5 lg:gap-7.5">
            <PersonalInfo />
            {profile?.role === 'comedian' && <ComedianProfile />}

            {showPreviewFeatures && (
              <>
                <FavoriteComediansSection />
                <SavedShowsSection />
                <Work />
                <RecentUploads title="My Files" />
              </>
            )}
          </div>
        </div>

        <div className="col-span-1">
          <div className="grid gap-5 lg:gap-7.5">
            {showPreviewFeatures ? (
              <>
                <BasicSettings title="Basic Settings" />

                <FavoriteVenuesSection />
                <CalendarAccounts />
                <Connections url="#" />
                <CommunityBadges />
              </>
            ) : (
              <>
                <FavoriteComediansSection />
                <SavedShowsSection />
                <FavoriteVenuesSection />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { AccountUserProfileContent };
