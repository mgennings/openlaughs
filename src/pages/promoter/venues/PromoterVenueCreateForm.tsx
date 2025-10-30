import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createVenue } from '@/graphql/mutations';

interface PromoterVenueCreateFormProps {
  onCreated?: () => void;
  onError?: (message: string) => void;
}

const client = generateClient({ authMode: 'userPool' });

const PromoterVenueCreateForm = ({
  onCreated,
  onError,
}: PromoterVenueCreateFormProps) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [openMic, setOpenMic] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const input = {
        name,
        address: address || null,
        city: city || null,
        openMic,
      } as any;

      const result = await client.graphql({
        query: (createVenue as string).replace(/__typename/g, ''),
        variables: { input },
      });

      if ('errors' in result && result.errors?.length) {
        const message = result.errors.map((e: any) => e.message).join(', ');
        throw new Error(message);
      }

      setName('');
      setAddress('');
      setCity('');
      setOpenMic(false);
      onCreated?.();
    } catch (err: any) {
      onError?.(err?.message || 'Failed to create venue');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="card-body flex flex-col gap-5 p-0" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <label className="form-label font-normal text-gray-900">Name</label>
        <input
          className="input"
          type="text"
          placeholder="Venue name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="form-label font-normal text-gray-900">Address</label>
        <input
          className="input"
          type="text"
          placeholder="Street address"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="form-label font-normal text-gray-900">City</label>
        <input
          className="input"
          type="text"
          placeholder="City"
          value={city}
          onChange={e => setCity(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="venue-openmic"
          className="form-check-input"
          type="checkbox"
          checked={openMic}
          onChange={e => setOpenMic(e.target.checked)}
        />
        <label
          htmlFor="venue-openmic"
          className="form-label font-normal text-gray-900 m-0"
        >
          Open mic venue
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          className="btn btn-light"
          onClick={() => {
            setName('');
            setAddress('');
            setCity('');
            setOpenMic(false);
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

export { PromoterVenueCreateForm };
