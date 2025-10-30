import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createShow } from '@/graphql/mutations';
import { listVenues } from '@/graphql/queries';
import type { ListVenuesQuery, Venue } from '@/API';

interface PromoterShowCreateFormProps {
  createdBy: string;
  onCreated?: () => void;
  onError?: (message: string) => void;
}

const client = generateClient({ authMode: 'userPool' });

const PromoterShowCreateForm = ({
  createdBy,
  onCreated,
  onError,
}: PromoterShowCreateFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [venueID, setVenueID] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venuesLoading, setVenuesLoading] = useState(false);
  const [venuesError, setVenuesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenues = async () => {
      setVenuesLoading(true);
      setVenuesError(null);
      try {
        const result = await client.graphql({
          query: (listVenues as string).replace(/__typename/g, ''),
          variables: { limit: 100 },
        });
        if ('data' in result) {
          const items =
            (result.data as ListVenuesQuery).listVenues?.items ?? [];
          setVenues(
            (items.filter(Boolean) as Venue[]).sort((a, b) =>
              (a.name || '').localeCompare(b.name || ''),
            ),
          );
        }
      } catch (err: any) {
        setVenuesError(err?.message || 'Failed to load venues');
      } finally {
        setVenuesLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const input = {
        title,
        description: description || null,
        dateTime: dateTime ? new Date(dateTime).toISOString() : null,
        venueID,
        createdBy,
      } as any;

      const result = await client.graphql({
        query: (createShow as string).replace(/__typename/g, ''),
        variables: { input },
      });

      if ('errors' in result && result.errors?.length) {
        const message = result.errors.map((e: any) => e.message).join(', ');
        throw new Error(message);
      }

      setTitle('');
      setDescription('');
      setDateTime('');
      setVenueID('');
      onCreated?.();
    } catch (err: any) {
      onError?.(err?.message || 'Failed to create show');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card-body flex flex-col gap-5 p-0" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <label className="form-label font-normal text-gray-900">Title</label>
        <input
          className="input"
          type="text"
          placeholder="Show title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="form-label font-normal text-gray-900">
          Description
        </label>
        <input
          className="input"
          type="text"
          placeholder="Optional description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="form-label font-normal text-gray-900">
          Date time
        </label>
        <input
          className="input"
          type="datetime-local"
          placeholder="mm/dd/yyyy, --:-- --"
          value={dateTime}
          onChange={e => setDateTime(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="form-label font-normal text-gray-900">Venue</label>
        <select
          className="input"
          value={venueID}
          onChange={e => setVenueID(e.target.value)}
          required
        >
          <option value="">
            {venuesLoading ? 'Loading venues…' : 'Select a venue'}
          </option>
          {venues.map(v => (
            <option key={v.id} value={v.id || ''}>
              {v.name}
              {v.city ? ` — ${v.city}` : ''}
            </option>
          ))}
        </select>
        {venuesError && (
          <span className="text-danger text-2sm">{venuesError}</span>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          className="btn btn-light"
          onClick={() => {
            setTitle('');
            setDescription('');
            setDateTime('');
            setVenueID('');
          }}
          disabled={submitting}
        >
          Clear
        </button>
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export { PromoterShowCreateForm };
