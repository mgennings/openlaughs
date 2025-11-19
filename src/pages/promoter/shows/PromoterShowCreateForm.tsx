import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createShow } from '@/graphql/mutations';
import { listVenues, listComedians } from '@/graphql/queries';
import { ImageInput, type TImageInputFiles } from '@/components/image-input';
import { uploadPublicImage } from '@/lib/storage';
import type {
  ListVenuesQuery,
  Venue,
  ListComediansQuery,
  Comedian,
} from '@/API';
import { AGE_RESTRICTIONS } from '@/config/constants';

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
  const [showImage, setShowImage] = useState<TImageInputFiles>([]);
  const [ticketUrl, setTicketUrl] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [ageRestriction, setAgeRestriction] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [venuesLoading, setVenuesLoading] = useState(false);
  const [venuesError, setVenuesError] = useState<string | null>(null);
  const [comedians, setComedians] = useState<Comedian[]>([]);
  const [selectedComedianIDs, setSelectedComedianIDs] = useState<string[]>([]);
  const [comediansLoading, setComediansLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setVenuesLoading(true);
      setComediansLoading(true);
      setVenuesError(null);
      try {
        // Fetch venues
        const venuesResult = await client.graphql({
          query: (listVenues as string).replace(/__typename/g, ''),
          variables: { limit: 100 },
        });
        if ('data' in venuesResult) {
          const items =
            (venuesResult.data as ListVenuesQuery).listVenues?.items ?? [];
          setVenues(
            (items.filter(Boolean) as Venue[]).sort((a, b) =>
              (a.name || '').localeCompare(b.name || ''),
            ),
          );
        }

        // Fetch comedians
        const comediansResult = await client.graphql({
          query: (listComedians as string).replace(/__typename/g, ''),
          variables: { limit: 100 },
        });
        if ('data' in comediansResult) {
          const items =
            (comediansResult.data as ListComediansQuery).listComedians?.items ??
            [];
          setComedians(
            (items.filter(Boolean) as Comedian[]).sort((a, b) =>
              (a.stageName || '').localeCompare(b.stageName || ''),
            ),
          );
        }
      } catch (err: any) {
        setVenuesError(err?.message || 'Failed to load data');
      } finally {
        setVenuesLoading(false);
        setComediansLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      // Upload image if provided
      let showImageKey: string | null = null;
      if (showImage.length > 0 && showImage[0].file) {
        const ext = showImage[0].file.name.split('.').pop() || 'jpg';
        const key = `show-images/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        await uploadPublicImage(key, showImage[0].file, showImage[0].file.type);
        showImageKey = key;
      }

      const input = {
        title,
        description: description || null,
        dateTime: dateTime ? new Date(dateTime).toISOString() : null,
        venueID,
        comedianIDs:
          selectedComedianIDs.length > 0 ? selectedComedianIDs : null,
        createdBy,
        showImageKey,
        ticketUrl: ticketUrl || null,
        ticketPrice: ticketPrice ? parseFloat(ticketPrice) : null,
        ageRestriction: ageRestriction || null,
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
      setSelectedComedianIDs([]);
      setShowImage([]);
      setTicketUrl('');
      setTicketPrice('');
      setAgeRestriction('');
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

      <div className="flex flex-col gap-1">
        <label className="form-label font-normal text-gray-900">
          Comedians
        </label>
        <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
          {comediansLoading ? (
            <span className="text-gray-500 text-sm">Loading comedians...</span>
          ) : comedians.length === 0 ? (
            <span className="text-gray-500 text-sm">
              No comedians available
            </span>
          ) : (
            <div className="space-y-2">
              {comedians.map(comedian => (
                <label
                  key={comedian.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedComedianIDs.includes(comedian.id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedComedianIDs([
                          ...selectedComedianIDs,
                          comedian.id,
                        ]);
                      } else {
                        setSelectedComedianIDs(
                          selectedComedianIDs.filter(id => id !== comedian.id),
                        );
                      }
                    }}
                  />
                  <span className="text-sm text-gray-900">
                    {comedian.stageName}
                    {comedian.basedIn && (
                      <span className="text-gray-500">
                        {' '}
                        — {comedian.basedIn}
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
        <span className="text-xs text-gray-500">
          Select one or more comedians performing in this show
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <label className="form-label font-normal text-gray-900">
          Ticket URL
        </label>
        <input
          className="input"
          type="url"
          placeholder="https://example.com/tickets"
          value={ticketUrl}
          onChange={e => setTicketUrl(e.target.value)}
        />
        <span className="text-xs text-gray-500">
          Link to ticketing page (Eventbrite, Ticketmaster, etc.)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1">
          <label className="form-label font-normal text-gray-900">
            Ticket Price
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">$</span>
            <input
              className="input"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={ticketPrice}
              onChange={e => setTicketPrice(e.target.value)}
            />
          </div>
          <span className="text-xs text-gray-500">
            Price per ticket (leave empty if free or price varies)
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label font-normal text-gray-900">
            Age Restriction
          </label>
          <select
            className="input"
            value={ageRestriction}
            onChange={e => setAgeRestriction(e.target.value)}
          >
            <option value="">Select age restriction</option>
            {AGE_RESTRICTIONS.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="form-label font-normal text-gray-900">
          Show Image
        </label>
        <ImageInput
          value={showImage}
          onChange={setShowImage}
          multiple={false}
          acceptType={['image/jpeg', 'image/png', 'image/webp']}
        >
          {({
            fileList,
            onImageUpload,
            onImageRemove,
            isDragging,
            dragProps,
          }) => (
            <div className="flex flex-col gap-3">
              <div
                {...dragProps}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={onImageUpload}
              >
                <div className="text-gray-600">
                  <p className="mb-2">
                    Click to upload or drag and drop image here
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, WEBP (recommended: 600x400px)
                  </p>
                </div>
              </div>
              {fileList.length > 0 && (
                <div className="relative group">
                  <img
                    src={fileList[0].dataURL}
                    alt="Show image preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => onImageRemove(0)}
                    className="absolute top-2 right-2 bg-danger text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </ImageInput>
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
            setShowImage([]);
            setTicketUrl('');
            setTicketPrice('');
            setAgeRestriction('');
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
