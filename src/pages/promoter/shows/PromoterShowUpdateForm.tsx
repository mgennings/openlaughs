import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { updateShow } from '@/graphql/mutations';
import { getShow, listVenues, listComedians } from '@/graphql/queries';
import { ImageInput, type TImageInputFiles } from '@/components/image-input';
import { uploadPublicImage, getPublicUrl } from '@/lib/storage';
import type {
  Show,
  Venue,
  ListVenuesQuery,
  Comedian,
  ListComediansQuery,
} from '@/API';
import { AGE_RESTRICTIONS } from '@/config/constants';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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
  const [comedians, setComedians] = useState<Comedian[]>([]);
  const [selectedComedianIDs, setSelectedComedianIDs] = useState<string[]>([]);
  const [comedianSearchOpen, setComedianSearchOpen] = useState(false);
  const [profileImageUrls, setProfileImageUrls] = useState<
    Record<string, string>
  >({});
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

          // Load existing comedian IDs
          if (show.comedianIDs && show.comedianIDs.length > 0) {
            setSelectedComedianIDs(
              show.comedianIDs.filter(Boolean) as string[],
            );
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

        // Load comedians
        const comediansResult = await client.graphql({
          query: (listComedians as string).replace(/__typename/g, ''),
          variables: { limit: 100 },
        });

        if ('data' in comediansResult) {
          const items =
            (comediansResult.data as ListComediansQuery).listComedians?.items ??
            [];
          const comediansList = (items.filter(Boolean) as Comedian[]).sort(
            (a, b) => (a.stageName || '').localeCompare(b.stageName || ''),
          );
          setComedians(comediansList);

          // Load profile images for comedians
          const imageUrls: Record<string, string> = {};
          for (const comedian of comediansList) {
            if (comedian.profileImageKey) {
              try {
                const url = await getPublicUrl(comedian.profileImageKey);
                imageUrls[comedian.id] = url.toString();
              } catch (err) {
                console.error(
                  `Failed to load image for comedian ${comedian.id}:`,
                  err,
                );
              }
            }
          }
          setProfileImageUrls(imageUrls);
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
        comedianIDs:
          selectedComedianIDs.length > 0 ? selectedComedianIDs : null,
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
          rows={3}
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
          Comedians
        </label>
        <Popover open={comedianSearchOpen} onOpenChange={setComedianSearchOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              role="combobox"
              aria-expanded={comedianSearchOpen}
              className="input flex items-center justify-between w-full text-left"
            >
              <span
                className={
                  selectedComedianIDs.length === 0
                    ? 'text-gray-400'
                    : 'text-gray-900'
                }
              >
                {selectedComedianIDs.length === 0
                  ? 'Search and select comedians...'
                  : `${selectedComedianIDs.length} comedian${selectedComedianIDs.length > 1 ? 's' : ''} selected`}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
          >
            <Command>
              <CommandInput placeholder="Search comedians..." />
              <CommandList>
                <CommandEmpty>No comedians found.</CommandEmpty>
                <CommandGroup>
                  {comedians.map(comedian => {
                    const isSelected = selectedComedianIDs.includes(
                      comedian.id,
                    );
                    return (
                      <CommandItem
                        key={comedian.id}
                        value={comedian.stageName}
                        onSelect={() => {
                          if (isSelected) {
                            setSelectedComedianIDs(
                              selectedComedianIDs.filter(
                                id => id !== comedian.id,
                              ),
                            );
                          } else {
                            setSelectedComedianIDs([
                              ...selectedComedianIDs,
                              comedian.id,
                            ]);
                          }
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            isSelected ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                        <span>{comedian.stageName}</span>
                        {comedian.basedIn && (
                          <span className="ml-2 text-gray-500 text-sm">
                            — {comedian.basedIn}
                          </span>
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Selected comedians as pills */}
        {selectedComedianIDs.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedComedianIDs.map(id => {
              const comedian = comedians.find(c => c.id === id);
              if (!comedian) return null;
              const imageUrl = profileImageUrls[comedian.id];
              const initials = comedian.stageName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={comedian.stageName}
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold flex-shrink-0">
                      {initials}
                    </div>
                  )}
                  {comedian.stageName}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedComedianIDs(
                        selectedComedianIDs.filter(cid => cid !== id),
                      )
                    }
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
        <span className="text-sm text-gray-500">
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
