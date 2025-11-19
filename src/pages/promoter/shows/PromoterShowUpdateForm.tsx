import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { updateShow } from '@/graphql/mutations';
import { getShow, listVenues } from '@/graphql/queries';
import { ImageInput, type TImageInputFiles } from '@/components/image-input';
import { uploadPublicImage, getPublicUrl } from '@/lib/storage';
import type { Show, Venue, ListVenuesQuery } from '@/API';
import { AGE_RESTRICTIONS } from '@/config/constants';

interface PromoterShowUpdateFormProps {
  showId: string;
  onUpdated?: () => void;
  onError?: (message: string) => void;
}

const client = generateClient({ authMode: 'userPool' });

const PromoterShowUpdateForm = ({
  showId,
  onUpdated,
  onError,
}: PromoterShowUpdateFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [venueID, setVenueID] = useState('');
  const [showImage, setShowImage] = useState<TImageInputFiles>([]);
  const [existingImageKey, setExistingImageKey] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [ticketUrl, setTicketUrl] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [ageRestriction, setAgeRestriction] = useState('');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadShow = async () => {
      try {
        // Load show data
        const result = await client.graphql({
          query: (getShow as string).replace(/__typename/g, ''),
          variables: { id: showId },
        });

        if ('data' in result && result.data?.getShow) {
          const show = result.data.getShow as Show;
          setTitle(show.title || '');
          setDescription(show.description || '');
          setVenueID(show.venueID || '');
          setTicketUrl(show.ticketUrl || '');
          setTicketPrice(show.ticketPrice?.toString() || '');
          setAgeRestriction(show.ageRestriction || '');

          // Format dateTime for datetime-local input
          if (show.dateTime) {
            const date = new Date(show.dateTime);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            setDateTime(`${year}-${month}-${day}T${hours}:${minutes}`);
          }

          // Load existing image if available
          if (show.showImageKey) {
            setExistingImageKey(show.showImageKey);
            const url = await getPublicUrl(show.showImageKey);
            setExistingImageUrl(url.toString());
          }
        }

        // Load venues
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
      } catch (err: any) {
        onError?.(err?.message || 'Failed to load show');
      } finally {
        setLoading(false);
      }
    };

    void loadShow();
  }, [showId, onError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      // Upload new image if provided, otherwise keep existing
      let showImageKey: string | null = existingImageKey;
      if (showImage.length > 0 && showImage[0].file) {
        const ext = showImage[0].file.name.split('.').pop() || 'jpg';
        const key = `show-images/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        await uploadPublicImage(key, showImage[0].file, showImage[0].file.type);
        showImageKey = key;
      }

      const input = {
        id: showId,
        title,
        description: description || null,
        dateTime: dateTime ? new Date(dateTime).toISOString() : null,
        venueID: venueID || null,
        showImageKey,
        ticketUrl: ticketUrl || null,
        ticketPrice: ticketPrice ? parseFloat(ticketPrice) : null,
        ageRestriction: ageRestriction || null,
      } as any;

      const result = await client.graphql({
        query: (updateShow as string).replace(/__typename/g, ''),
        variables: { input },
      });

      if ('errors' in result && result.errors?.length) {
        const message = result.errors.map((e: any) => e.message).join(', ');
        throw new Error(message);
      }

      onUpdated?.();
    } catch (err: any) {
      onError?.(err?.message || 'Failed to update show');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div
          className="spinner-border spinner-border-sm text-primary"
          role="status"
        />
        <span className="ml-2 text-gray-600">Loading show...</span>
      </div>
    );
  }

  return (
    <form className="card-body flex flex-col gap-5 p-0" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <label className="form-label font-normal text-gray-900">
          Title <span className="text-danger">*</span>
        </label>
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
        <textarea
          className="textarea"
          rows={5}
          placeholder="Optional description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="form-label font-normal text-gray-900">
          Date & Time <span className="text-danger">*</span>
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
        <label className="form-label font-normal text-gray-900">
          Venue <span className="text-danger">*</span>
        </label>
        <select
          className="select"
          value={venueID}
          onChange={e => setVenueID(e.target.value)}
          required
        >
          <option value="">Select a venue</option>
          {venues.map(v => (
            <option key={v.id} value={v.id || ''}>
              {v.name}
              {v.city ? ` — ${v.city}` : ''}
            </option>
          ))}
        </select>
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
        <span className="text-sm text-gray-500">
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
          <span className="text-sm text-gray-500">
            Price per ticket (leave empty if free or price varies)
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label font-normal text-gray-900">
            Age Restriction
          </label>
          <select
            className="select"
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
              {existingImageUrl && !fileList.length && (
                <div className="relative group">
                  <img
                    src={existingImageUrl}
                    alt="Current show image"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setExistingImageKey(null);
                      setExistingImageUrl(null);
                    }}
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
                    {existingImageUrl && !fileList.length
                      ? 'Click to replace image or drag and drop new image'
                      : 'Click to upload or drag and drop image here'}
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
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Updating…' : 'Update Show'}
        </button>
      </div>
    </form>
  );
};

export { PromoterShowUpdateForm };
