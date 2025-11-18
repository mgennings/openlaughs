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
    <div className={`card h-full ${className}`}>
      <div className="card-header border-0 pt-9">
        <div className="card-title">
          <h3 className="text-2xl font-semibold text-gray-900">
            Upcoming Shows
          </h3>
        </div>
        <div className="card-toolbar">
          <Link to="/shows" className="btn btn-sm btn-light-primary">
            View All
            <KeenIcon icon="arrow-right" className="ms-2" />
          </Link>
        </div>
      </div>
      <div className="card-body pt-0 pb-9">
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
