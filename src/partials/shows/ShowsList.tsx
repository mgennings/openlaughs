import { useEffect, useMemo, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listShows, listVenues } from '@/graphql/queries';
import { getPublicUrl } from '@/lib/storage';
import type { ListShowsQuery, ListVenuesQuery, Show, Venue } from '@/API';
import { CardWork } from '@/partials/cards/CardWork';
import { KeenIcon } from '@/components';

const userClient = generateClient({ authMode: 'userPool' });
const publicClient = generateClient({ authMode: 'apiKey' });

export type ShowTimeFilter = 'all' | 'upcoming' | 'past';
export type ShowSortOption = 'date-asc' | 'date-desc';

interface ShowsListProps {
  /** Filter shows by venue ID */
  venueFilter?: string | null;
  /** Filter shows by time (all, upcoming, past) */
  timeFilter?: ShowTimeFilter;
  /** Sort option */
  sortBy?: ShowSortOption;
  /** Maximum number of shows to display (0 = all) */
  limit?: number;
  /** Whether to show filters UI */
  showFilters?: boolean;
  /** Whether to show in compact/widget mode */
  compact?: boolean;
  /** Custom title link format - use :id for show ID placeholder */
  titleLinkFormat?: string;
  /** Callback when shows are loaded */
  onShowsLoaded?: (shows: Show[]) => void;
}

const ShowsList = ({
  venueFilter = null,
  timeFilter = 'upcoming',
  sortBy = 'date-asc',
  limit = 0,
  showFilters = false,
  compact = false,
  titleLinkFormat = '/shows/:id',
  onShowsLoaded,
}: ShowsListProps) => {
  const [shows, setShows] = useState<Show[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [showImageUrls, setShowImageUrls] = useState<Record<string, string>>(
    {},
  );
  const [venueLogoUrls, setVenueLogoUrls] = useState<Record<string, string>>(
    {},
  );
  const [venueMap, setVenueMap] = useState<Record<string, Venue>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVenueFilter, setSelectedVenueFilter] = useState<string>('');
  const [selectedTimeFilter, setSelectedTimeFilter] =
    useState<ShowTimeFilter>(timeFilter);
  const [selectedSort, setSelectedSort] = useState<ShowSortOption>(sortBy);

  // Fetch venues for filter dropdown
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        let result: any;
        try {
          result = await userClient.graphql({
            query: (listVenues as string).replace(/__typename/g, ''),
            variables: { limit: 100 },
          });
        } catch (e: any) {
          result = await publicClient.graphql({
            query: (listVenues as string).replace(/__typename/g, ''),
            variables: { limit: 100 },
          });
        }

        if ('data' in result) {
          const items =
            (result.data as ListVenuesQuery).listVenues?.items ?? [];
          const validVenues = items.filter(Boolean) as Venue[];
          setVenues(
            validVenues.sort((a, b) =>
              (a.name || '').localeCompare(b.name || ''),
            ),
          );

          // Create venue map for quick lookup
          const map: Record<string, Venue> = {};
          validVenues.forEach(venue => {
            if (venue.id) {
              map[venue.id] = venue;
            }
          });
          setVenueMap(map);

          // Fetch logo URLs for venues with logoKey
          const logoUrlMap: Record<string, string> = {};
          await Promise.all(
            validVenues.map(async venue => {
              if (venue.logoKey && venue.id) {
                try {
                  const url = await getPublicUrl(venue.logoKey);
                  logoUrlMap[venue.id] = url.toString();
                } catch (err) {
                  console.error(
                    `Failed to get logo URL for venue ${venue.id}:`,
                    err,
                  );
                }
              }
            }),
          );
          setVenueLogoUrls(logoUrlMap);
        }
      } catch (err) {
        console.error('Failed to load venues:', err);
      }
    };

    void fetchVenues();
  }, []);

  // Fetch shows
  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      setError(null);
      try {
        // Build filter
        const filter: any = {};
        if (venueFilter) {
          filter.venueID = { eq: venueFilter };
        }

        let result: any;
        try {
          result = await userClient.graphql({
            query: (listShows as string).replace(/__typename/g, ''),
            variables: {
              filter: Object.keys(filter).length > 0 ? filter : undefined,
              limit: 200, // Fetch more than we need for client-side filtering
            },
          });
        } catch (e: any) {
          // Retry with API key if userPool is not authorized for read
          result = await publicClient.graphql({
            query: (listShows as string).replace(/__typename/g, ''),
            variables: {
              filter: Object.keys(filter).length > 0 ? filter : undefined,
              limit: 200,
            },
          });
        }

        if ('data' in result) {
          const items = (result.data as ListShowsQuery).listShows?.items ?? [];
          const validShows = items.filter(Boolean) as Show[];
          setShows(validShows);

          // Fetch image URLs for shows with showImageKey
          const imageUrlMap: Record<string, string> = {};
          await Promise.all(
            validShows.map(async show => {
              if (show.showImageKey) {
                try {
                  const url = await getPublicUrl(show.showImageKey);
                  imageUrlMap[show.id] = url.toString();
                } catch (err) {
                  console.error(
                    `Failed to get image URL for show ${show.id}:`,
                    err,
                  );
                }
              }
            }),
          );
          setShowImageUrls(imageUrlMap);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load shows');
      } finally {
        setLoading(false);
      }
    };

    void fetchShows();
  }, [venueFilter]);

  // Filter and sort shows
  const filteredAndSortedShows = useMemo(() => {
    const now = new Date();
    let filtered = shows;

    // Apply time filter
    const effectiveTimeFilter = showFilters ? selectedTimeFilter : timeFilter;
    if (effectiveTimeFilter === 'upcoming') {
      filtered = filtered.filter(
        show => new Date(show.dateTime).getTime() >= now.getTime(),
      );
    } else if (effectiveTimeFilter === 'past') {
      filtered = filtered.filter(
        show => new Date(show.dateTime).getTime() < now.getTime(),
      );
    }

    // Apply venue filter from UI
    if (showFilters && selectedVenueFilter) {
      filtered = filtered.filter(show => show.venueID === selectedVenueFilter);
    }

    // Apply sorting
    const effectiveSort = showFilters ? selectedSort : sortBy;
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.dateTime).getTime();
      const dateB = new Date(b.dateTime).getTime();
      return effectiveSort === 'date-asc' ? dateA - dateB : dateB - dateA;
    });

    // Apply limit
    if (limit > 0) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [
    shows,
    timeFilter,
    selectedTimeFilter,
    selectedVenueFilter,
    sortBy,
    selectedSort,
    showFilters,
    limit,
  ]);

  // Notify parent when shows are loaded
  useEffect(() => {
    if (onShowsLoaded && filteredAndSortedShows.length > 0) {
      onShowsLoaded(filteredAndSortedShows);
    }
  }, [filteredAndSortedShows, onShowsLoaded]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div
          className="spinner-border spinner-border-sm text-primary"
          role="status"
        />
        <span className="ml-2 text-gray-600">Loading shows...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <div className="card p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Venue Filter */}
            <div>
              <label className="form-label text-sm font-medium text-gray-700 mb-2">
                Venue
              </label>
              <select
                className="form-select"
                value={selectedVenueFilter}
                onChange={e => setSelectedVenueFilter(e.target.value)}
              >
                <option value="">All Venues</option>
                {venues.map(venue => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Filter */}
            <div>
              <label className="form-label text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <select
                className="form-select"
                value={selectedTimeFilter}
                onChange={e =>
                  setSelectedTimeFilter(e.target.value as ShowTimeFilter)
                }
              >
                <option value="all">All Shows</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="form-label text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                className="form-select"
                value={selectedSort}
                onChange={e =>
                  setSelectedSort(e.target.value as ShowSortOption)
                }
              >
                <option value="date-asc">Date (Earliest First)</option>
                <option value="date-desc">Date (Latest First)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      {showFilters && (
        <div className="text-sm text-gray-600">
          Showing {filteredAndSortedShows.length} show
          {filteredAndSortedShows.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Shows Grid */}
      {filteredAndSortedShows.length === 0 ? (
        <div className="card p-10 text-center">
          <KeenIcon
            icon="file-deleted"
            className="text-4xl text-gray-400 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Shows Found
          </h3>
          <p className="text-gray-600">
            {showFilters
              ? 'Try adjusting your filters to see more shows.'
              : 'No shows match your criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredAndSortedShows.map(show => {
            const venue = venueMap[show.venueID];
            const venueName = venue?.name || 'Unknown Venue';
            const venueLogoUrl = venue?.id
              ? venueLogoUrls[venue.id]
              : undefined;
            const titleLink = titleLinkFormat.replace(':id', show.id);

            return (
              <CardWork
                key={show.id}
                title={show.title || 'Untitled Show'}
                description={show.description || undefined}
                dateTime={show.dateTime}
                image={'1.jpg'}
                showImageUrl={showImageUrls[show.id]}
                authorName={venueName}
                authorAvatar={'300-1.png'}
                authorAvatarUrl={venueLogoUrl}
                titleLink={titleLink}
                likes={0}
                comments={0}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export { ShowsList, type ShowsListProps };
