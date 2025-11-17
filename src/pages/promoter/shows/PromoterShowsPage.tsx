import { useEffect, useMemo, useState } from 'react';
import { Container } from '@/components/container';
import { KeenIcon } from '@/components';
import { CardWork } from '@/partials/cards/CardWork';
import { PromoterShowCreateForm } from './PromoterShowCreateForm';
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

  const createdBy = useMemo(
    () => currentUser?.email || currentUser?.username || '',
    [currentUser?.email, currentUser?.username],
  );

  const avatarUrl = useUserAvatar(currentUser?.email);

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

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">My Shows</h2>
        <div className="text-gray-600 flex items-center gap-2">
          <KeenIcon icon="calendar" />
          <span>{shows.length} total</span>
        </div>
      </div>

      <div className="card p-5 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Create a Show
        </h3>
        <PromoterShowCreateForm
          createdBy={createdBy}
          onCreated={() => fetchShows()}
          onError={message => setError(message)}
        />
      </div>

      {error && (
        <div className="alert alert-danger mb-6">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <div
            className="spinner-border spinner-border-sm text-primary"
            role="status"
          />
          <span>Loading shows…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7.5">
          {shows
            .sort((a, b) => {
              // Sort by nearest showtime first (ascending date order)
              const dateA = new Date(a.dateTime).getTime();
              const dateB = new Date(b.dateTime).getTime();
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
