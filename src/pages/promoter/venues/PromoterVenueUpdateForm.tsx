import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { updateVenue } from '@/graphql/mutations';
import { getVenue } from '@/graphql/queries';
import { ImageInput, type TImageInputFiles } from '@/components/image-input';
import { uploadPublicImage, getPublicUrl } from '@/lib/storage';
import type { Venue } from '@/API';
import { US_STATES } from '@/config/constants';
import {
  validatePhoneNumber,
  validateEmail,
  formatPhoneInput,
  formatPhoneForDisplay,
  cleanPhoneNumber,
  cleanEmail,
} from '@/utils/validation';

interface PromoterVenueUpdateFormProps {
  venueId: string;
  onUpdated?: () => void;
  onError?: (message: string) => void;
}

const client = generateClient({ authMode: 'userPool' });

const PromoterVenueUpdateForm = ({
  venueId,
  onUpdated,
  onError,
}: PromoterVenueUpdateFormProps) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [openMic, setOpenMic] = useState(false);
  const [bio, setBio] = useState('');
  const [description, setDescription] = useState('');
  const [googleReviewsLink, setGoogleReviewsLink] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [venueImages, setVenueImages] = useState<TImageInputFiles>([]);
  const [existingImageKeys, setExistingImageKeys] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [logoImage, setLogoImage] = useState<TImageInputFiles>([]);
  const [existingLogoKey, setExistingLogoKey] = useState<string | null>(null);
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [contactErrors, setContactErrors] = useState<Record<string, string>>(
    {},
  );

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneInput(value);
    setPhone(formatted);

    const validation = validatePhoneNumber(formatted);
    if (!validation.valid && validation.error) {
      setContactErrors({ ...contactErrors, phone: validation.error });
    } else {
      const { phone: _, ...rest } = contactErrors;
      setContactErrors(rest);
    }
  };

  const handleEmailChange = (value: string) => {
    const cleanValue = cleanEmail(value);
    setEmail(cleanValue);

    if (cleanValue) {
      const validation = validateEmail(cleanValue);
      if (!validation.valid && validation.error) {
        setContactErrors({ ...contactErrors, email: validation.error });
      } else {
        const { email: _, ...rest } = contactErrors;
        setContactErrors(rest);
      }
    } else {
      const { email: _, ...rest } = contactErrors;
      setContactErrors(rest);
    }
  };

  useEffect(() => {
    const loadVenue = async () => {
      try {
        const result = await client.graphql({
          query: (getVenue as string).replace(/__typename/g, ''),
          variables: { id: venueId },
        });

        if ('data' in result && result.data?.getVenue) {
          const venue = result.data.getVenue as Venue;
          setName(venue.name || '');
          setAddress(venue.address || '');
          setCity(venue.city || '');
          setState(venue.state || '');
          setPostalCode(venue.postalCode || '');
          setCountry(venue.country || '');
          setOpenMic(venue.openMic || false);
          setBio(venue.bio || '');
          setDescription(venue.description || '');
          setGoogleReviewsLink(venue.googleReviewsLink || '');
          setWebsite(venue.website || '');
          setPhone(formatPhoneForDisplay(venue.phone || ''));
          setEmail(venue.email || '');

          if (venue.venueImageKeys && venue.venueImageKeys.length > 0) {
            const validKeys = venue.venueImageKeys.filter(
              (key): key is string => key !== null && key !== undefined,
            );
            setExistingImageKeys(validKeys);
            // Load existing image URLs
            const urls = await Promise.all(
              validKeys.map(key => getPublicUrl(key)),
            );
            setExistingImageUrls(urls.map(url => url.toString()));
          }

          // Load existing logo if available
          if (venue.logoKey) {
            setExistingLogoKey(venue.logoKey);
            try {
              const logoUrl = await getPublicUrl(venue.logoKey);
              setExistingLogoUrl(logoUrl.toString());
            } catch (err) {
              console.error('Failed to load logo URL:', err);
            }
          }
        }
      } catch (err: any) {
        onError?.(err?.message || 'Failed to load venue');
      } finally {
        setLoading(false);
      }
    };

    void loadVenue();
  }, [venueId, onError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      // Upload new images
      const newImageKeys: string[] = [];
      for (const imageFile of venueImages) {
        if (imageFile.file) {
          const ext = imageFile.file.name.split('.').pop() || 'jpg';
          const key = `venue-images/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
          await uploadPublicImage(key, imageFile.file, imageFile.file.type);
          newImageKeys.push(key);
        }
      }

      // Combine existing and new image keys
      const allImageKeys = [...existingImageKeys, ...newImageKeys];

      // Upload new logo if provided, otherwise keep existing (or null if removed)
      let logoKey: string | null = existingLogoKey;
      if (logoImage.length > 0 && logoImage[0].file) {
        const ext = logoImage[0].file.name.split('.').pop() || 'jpg';
        const key = `venue-logos/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        await uploadPublicImage(key, logoImage[0].file, logoImage[0].file.type);
        logoKey = key;
      } else if (!existingLogoKey) {
        // If no existing logo and no new logo uploaded, set to null
        logoKey = null;
      }

      const input = {
        id: venueId,
        name,
        address: address || null,
        city: city || null,
        state: state || null,
        postalCode: postalCode || null,
        country: country || null,
        openMic,
        bio: bio || null,
        description: description || null,
        venueImageKeys: allImageKeys.length > 0 ? allImageKeys : null,
        logoKey: logoKey,
        googleReviewsLink: googleReviewsLink || null,
        website: website || null,
        phone: phone ? cleanPhoneNumber(phone) : null,
        email: email || null,
      } as any;

      const result = await client.graphql({
        query: (updateVenue as string).replace(/__typename/g, ''),
        variables: { input },
      });

      if ('errors' in result && result.errors?.length) {
        const message = result.errors.map((e: any) => e.message).join(', ');
        throw new Error(message);
      }

      onUpdated?.();
    } catch (err: any) {
      onError?.(err?.message || 'Failed to update venue');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveExistingImage = (index: number) => {
    const newKeys = existingImageKeys.filter((_, i) => i !== index);
    const newUrls = existingImageUrls.filter((_, i) => i !== index);
    setExistingImageKeys(newKeys);
    setExistingImageUrls(newUrls);
  };

  const handleRemoveExistingLogo = () => {
    setExistingLogoKey(null);
    setExistingLogoUrl(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div
          className="spinner-border spinner-border-sm text-primary"
          role="status"
        />
        <span className="ml-2 text-gray-600">Loading venue...</span>
      </div>
    );
  }

  return (
    <form className="card-body flex flex-col gap-5 p-0" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <label className="form-label font-normal text-gray-900">
          Name <span className="text-danger">*</span>
        </label>
        <input
          className="input"
          type="text"
          placeholder="Venue name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="form-label font-normal text-gray-900">
            Address
          </label>
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

        <div className="flex flex-col gap-1">
          <label className="form-label font-normal text-gray-900">State</label>
          <select
            className="input"
            value={state}
            onChange={e => setState(e.target.value)}
          >
            {US_STATES.map(stateOption => (
              <option key={stateOption.value} value={stateOption.value}>
                {stateOption.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label font-normal text-gray-900">
            Postal Code
          </label>
          <input
            className="input"
            type="text"
            placeholder="Postal/ZIP code"
            value={postalCode}
            onChange={e => setPostalCode(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label font-normal text-gray-900">
            Country
          </label>
          <input
            className="input"
            type="text"
            placeholder="Country"
            value={country}
            onChange={e => setCountry(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="form-label font-normal text-gray-900">Bio</label>
        <textarea
          className="textarea"
          rows={3}
          placeholder="Short bio or tagline for the venue"
          value={bio}
          onChange={e => setBio(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="form-label font-normal text-gray-900">
          Description
        </label>
        <textarea
          className="textarea"
          rows={5}
          placeholder="Detailed description of the venue"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="form-label font-normal text-gray-900">
          Venue Logo
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Upload a logo for the venue (square format recommended)
        </p>
        {existingLogoUrl && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-2">Current Logo:</p>
            <div className="flex justify-start">
              <div className="relative group w-32 h-32">
                <img
                  src={existingLogoUrl}
                  alt="Venue logo"
                  className="w-full h-full object-contain rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleRemoveExistingLogo}
                  className="absolute top-2 right-2 bg-danger text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
            </div>
          </div>
        )}
        <ImageInput
          value={logoImage}
          onChange={setLogoImage}
          multiple={false}
          maxNumber={1}
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
                    Click to upload or drag and drop logo here
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, WEBP (single image)
                  </p>
                </div>
              </div>
              {fileList.length > 0 && (
                <div className="flex justify-center">
                  <div className="relative group w-32 h-32">
                    <img
                      src={fileList[0].dataURL}
                      alt="Venue logo"
                      className="w-full h-full object-contain rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => onImageRemove(0)}
                      className="absolute top-2 right-2 bg-danger text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                </div>
              )}
            </div>
          )}
        </ImageInput>
      </div>

      <div className="flex flex-col gap-1">
        <label className="form-label font-normal text-gray-900">
          Venue Images
        </label>
        {existingImageUrls.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-2">Existing Images:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {existingImageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Venue image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    className="absolute top-2 right-2 bg-danger text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
              ))}
            </div>
          </div>
        )}
        <ImageInput
          value={venueImages}
          onChange={setVenueImages}
          multiple
          maxNumber={10}
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
                    Click to upload or drag and drop images here
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, WEBP up to 10 images
                  </p>
                </div>
              </div>
              {fileList.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {fileList.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={file.dataURL}
                        alt={`Venue image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => onImageRemove(index)}
                        className="absolute top-2 right-2 bg-danger text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                  ))}
                </div>
              )}
            </div>
          )}
        </ImageInput>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="form-label font-normal text-gray-900">
            Google Reviews Link
          </label>
          <input
            className="input"
            type="url"
            placeholder="https://maps.google.com/..."
            value={googleReviewsLink}
            onChange={e => setGoogleReviewsLink(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Link to your venue's Google Maps/Reviews page
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label font-normal text-gray-900">
            Website
          </label>
          <input
            className="input"
            type="url"
            placeholder="https://example.com"
            value={website}
            onChange={e => setWebsite(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label font-normal text-gray-900">Phone</label>
          <input
            className={`input ${contactErrors.phone ? 'border-danger' : ''}`}
            type="tel"
            placeholder="(555) 555-5555"
            value={phone}
            onChange={e => handlePhoneChange(e.target.value)}
            maxLength={14}
          />
          {contactErrors.phone && (
            <p className="text-xs text-danger mt-1">{contactErrors.phone}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label font-normal text-gray-900">Email</label>
          <input
            className={`input ${contactErrors.email ? 'border-danger' : ''}`}
            type="email"
            placeholder="venue@example.com"
            value={email}
            onChange={e => handleEmailChange(e.target.value)}
          />
          {contactErrors.email && (
            <p className="text-xs text-danger mt-1">{contactErrors.email}</p>
          )}
        </div>
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
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Updating…' : 'Update Venue'}
        </button>
      </div>
    </form>
  );
};

export { PromoterVenueUpdateForm };
