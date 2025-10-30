import { useEffect, useState } from 'react';
import { Container } from '@/components/container';
import { KeenIcon } from '@/components';
import { generateClient } from 'aws-amplify/api';
import { listVenues } from '@/graphql/queries';
import type { ListVenuesQuery, Venue } from '@/API';
import { PromoterVenueCreateForm } from './PromoterVenueCreateForm';

const userClient = generateClient({ authMode: 'userPool' });
const publicClient = generateClient({ authMode: 'apiKey' });

const PromoterVenuesPage = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      let result: any;
      try {
        result = await userClient.graphql({
          query: (listVenues as string).replace(/__typename/g, ''),
          variables: { limit: 100 },
        });
      } catch (e: any) {
        // Retry with API key if userPool is not authorized for read
        result = await publicClient.graphql({
          query: (listVenues as string).replace(/__typename/g, ''),
          variables: { limit: 100 },
        });
      }
      if ('data' in result) {
        const items = (result.data as ListVenuesQuery).listVenues?.items ?? [];
        setVenues((items.filter(Boolean) as Venue[]).sort((a, b) => (a.name || '').localeCompare(b.name || '')));
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load venues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">My Venues</h2>
        <div className="text-gray-600 flex items-center gap-2">
          <KeenIcon icon="home" />
          <span>{venues.length} total</span>
        </div>
      </div>

      <div className="card p-5 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Create a Venue</h3>
        <PromoterVenueCreateForm onCreated={fetchVenues} onError={(m) => setError(m)} />
      </div>

      {error && (
        <div className="alert alert-danger mb-6">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <div className="spinner-border spinner-border-sm text-primary" role="status" />
          <span>Loading venues…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7.5">
          {venues.map(v => (
            <div className="card p-5" key={v.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{v.name}</h4>
                  <div className="text-sm text-gray-700">{v.city || '—'}</div>
                  <div className="text-sm text-gray-600">{v.address || ''}</div>
                </div>
                {v.openMic ? (
                  <span className="badge badge-success">Open Mic</span>
                ) : (
                  <span className="badge badge-light">Venue</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export { PromoterVenuesPage };


