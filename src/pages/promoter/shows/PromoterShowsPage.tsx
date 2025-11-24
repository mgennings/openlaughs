import { useEffect, useMemo, useState } from 'react';
import { Container } from '@/components/container';
import { KeenIcon } from '@/components';
import { CardWork } from '@/partials/cards/CardWork';
import { ModalCreateShow } from './ModalCreateShow';
import { generateClient } from 'aws-amplify/api';
import { listShows } from '@/graphql/queries';
import { getPublicUrl } from '@/lib/storage';
import type { ListShowsQuery, Show } from '@/API';
import { useAuthContext } from '@/auth/useAuthContext';
import { useUserAvatar } from '@/hooks';

const client = generateClient({ authMode: 'userPool' });

const PromoterShowsPage = () => {
  const { currentUser } = useAuthContext();
  const [shows, setShows] = useState<Show[]>([]);
  const [showImageUrls, setShowImageUrls] = useState<Record<string, string>>(
    {},
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [includePastShows, setIncludePastShows] = useState(false);

  const createdBy = useMemo(
    () => currentUser?.email || currentUser?.username || '',
    [currentUser?.email, currentUser?.username],
  );

  const avatarUrl = useUserAvatar();

  const fetchShows = async () => {
    if (!createdBy) return;
    setLoading(true);
    setError(null);
    try {
      const result = await client.graphql({
        query: (listShows as string).replace(/__typename/g, ''),
        variables: {
          filter: {
            createdBy: { eq: createdBy },
          },
          limit: 50,
        },
      });

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

  useEffect(() => {
    fetchShows();
  }, [createdBy]);

  // Filter shows based on whether to include past shows
  const filteredShows = useMemo(() => {
    if (includePastShows) {
      return shows; // Show all shows
    }
    const now = new Date();
    return shows.filter(show => {
      const showDate = new Date(show.dateTime);
      return showDate >= now; // Only upcoming shows
    });
  }, [shows, includePastShows]);

  return (
    <Container>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            My Shows
          </h2>
          <div className="flex items-center gap-4">
            <button
              className="btn btn-primary btn-sm md:btn-md md:text-sm md:px-4 md:py-2.5"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <KeenIcon
                icon="plus"
                className="me-2 btn-icon-sm md:btn-icon-md"
              />
              Create Show
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          {/* Toggle to include past shows */}

          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={includePastShows}
              onChange={e => setIncludePastShows(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="select-none ms-3 text-sm font-medium text-gray-900">
              Include Past Shows
            </span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <div className="text-gray-600 flex items-center gap-2">
              <KeenIcon icon="calendar" />
              <span>{filteredShows.length} total</span>
            </div>
          </label>
        </div>
      </div>

      <ModalCreateShow
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        createdBy={createdBy}
        onCreated={() => fetchShows()}
        onError={message => setError(message)}
      />

      {error && (
        <div className="alert alert-danger mb-6">
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-gray-600">
          <div
            className="spinner-border spinner-border-sm text-primary"
            role="status"
          />
          <span>Loading shows…</span>
        </div>
      )}

      {filteredShows.length === 0 ? (
        <div className="text-center py-20">
          <KeenIcon icon="calendar-2" className="text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {shows.length === 0 ? 'No Shows Added Yet' : 'No Upcoming Shows'}
          </h3>
          <p className="text-gray-500 mb-6">
            {shows.length === 0
              ? 'Add your first show to get started'
              : 'All your shows are in the past. Check "Include Past Shows" to see them.'}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <KeenIcon icon="plus" className="me-2" />
            Add Show
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7.5">
          {filteredShows
            .sort((a, b) => {
              const dateA = new Date(a.dateTime).getTime();
              const dateB = new Date(b.dateTime).getTime();

              // Sort all shows by date chronologically (earliest first)
              return dateA - dateB;
            })
            .map(show => {
              return (
                <CardWork
                  key={show.id}
                  title={show.title || 'Untitled Show'}
                  description={show.description || undefined}
                  dateTime={show.dateTime}
                  image={'1.jpg'}
                  showImageUrl={showImageUrls[show.id]}
                  authorName={
                    currentUser?.fullname || currentUser?.username || 'Me'
                  }
                  authorAvatar={'300-1.png'}
                  authorAvatarUrl={avatarUrl}
                  titleLink={`/promoter/shows/${show.id}`}
                  likes={0}
                  comments={0}
                />
              );
            })}
        </div>
      )}
    </Container>
  );
};

export { PromoterShowsPage };
