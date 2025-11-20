import {
  ChannelStats,
  EarningsChart,
  EntryCallout,
  Highlights,
  PlatformStats,
  TeamMeeting,
  Venues,
} from './blocks';
import { ShowsWidget } from '@/partials/shows';

const Demo1LightSidebarContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      {/* Platform Stats - Admin Quick View */}
      <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-1">
          <PlatformStats />
        </div>

        <div className="lg:col-span-2">
          <EntryCallout className="h-full" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-y-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-1">
          <div className="grid grid-cols-2 gap-5 lg:gap-7.5 h-full items-stretch">
            <ChannelStats />
          </div>
        </div>

        <div className="lg:col-span-2">
          <Highlights limit={3} />
        </div>
      </div>

      <div className="grid lg:grid-cols-1 gap-5 lg:gap-7.5 items-stretch">
        <EarningsChart />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-1">
          <TeamMeeting />
        </div>

        <div className="lg:col-span-2">
          <Venues />
        </div>
      </div>

      <div className="grid lg:grid-cols-1 gap-5 lg:gap-7.5 items-stretch">
        <ShowsWidget limit={6} />
      </div>
    </div>
  );
};

export { Demo1LightSidebarContent };
