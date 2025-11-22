import { Link } from 'react-router-dom';
import { ShowsList } from './ShowsList';
import { KeenIcon } from '@/components';

interface ShowsWidgetProps {
  /** Maximum number of shows to display */
  limit?: number;
  /** Additional CSS classes */
  className?: string;
}

const ShowsWidget = ({ limit = 6, className = '' }: ShowsWidgetProps) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">
          Upcoming Shows
        </h3>
        <Link to="/shows" className="btn btn-sm btn-light-primary">
          View All
          <KeenIcon icon="arrow-right" className="ms-2" />
        </Link>
      </div>

      {/* Shows - edge-to-edge on mobile, in card on desktop */}
      <div className="md:h-full">
        <ShowsList
          timeFilter="upcoming"
          sortBy="date-asc"
          limit={limit}
          showFilters={false}
          compact={true}
          titleLinkFormat="/shows/:id"
        />
      </div>
    </div>
  );
};

export { ShowsWidget, type ShowsWidgetProps };
