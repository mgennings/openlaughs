import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createVenue } from '@/graphql/mutations';
import { ImageInput, type TImageInputFiles } from '@/components/image-input';
import { uploadPublicImage } from '@/lib/storage';
import { US_STATES } from '@/config/constants';
import { GooglePlacesAutocomplete } from '@/components/google-places';
import {
  validatePhoneNumber,
  validateEmail,
  formatPhoneInput,
  cleanPhoneNumber,
  cleanEmail,
} from '@/utils/validation';

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
  const [state, setState] = useState('TX');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [openMic, setOpenMic] = useState(false);
  const [bio, setBio] = useState('');
  const [description, setDescription] = useState('');
  const [googleReviewsLink, setGoogleReviewsLink] = useState('');
  const [googlePlaceId, setGooglePlaceId] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [venueImages, setVenueImages] = useState<TImageInputFiles>([]);
  const [logoImage, setLogoImage] = useState<TImageInputFiles>([]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      // Upload images first
      const imageKeys: string[] = [];
      for (const imageFile of venueImages) {
        if (imageFile.file) {
          const ext = imageFile.file.name.split('.').pop() || 'jpg';
          const key = `venue-images/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
          await uploadPublicImage(key, imageFile.file, imageFile.file.type);
          imageKeys.push(key);
        }
      }

      // Upload logo if provided
      let logoKey: string | null = null;
      if (logoImage.length > 0 && logoImage[0].file) {
        const ext = logoImage[0].file.name.split('.').pop() || 'jpg';
        const key = `venue-logos/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        await uploadPublicImage(key, logoImage[0].file, logoImage[0].file.type);
        logoKey = key;
      }

      const input = {
        name,
        address: address || null,
        city: city || null,
        state: state || null,
        postalCode: postalCode || null,
        country: country || null,
        openMic,
        bio: bio || null,
        description: description || null,
        venueImageKeys: imageKeys.length > 0 ? imageKeys : null,
        logoKey: logoKey,
        googleReviewsLink: googleReviewsLink || null,
        googlePlaceId: googlePlaceId || null,
        website: website || null,
        phone: phone ? cleanPhoneNumber(phone) : null,
        email: email || null,
      } as any;

      const result = await client.graphql({
        query: (createVenue as string).replace(/__typename/g, ''),
        variables: { input },
      });

      if ('errors' in result && result.errors?.length) {
        const message = result.errors.map((e: any) => e.message).join(', ');
        throw new Error(message);
      }

      // Reset form
      setName('');
      setAddress('');
      setCity('');
      setState('');
      setPostalCode('');
      setCountry('');
      setOpenMic(false);
      setBio('');
      setDescription('');
      setGoogleReviewsLink('');
      setGooglePlaceId('');
      setWebsite('');
      setPhone('');
      setEmail('');
      setVenueImages([]);
      setLogoImage([]);
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
        <label className="form-label font-normal text-gray-900">
          Search for Venue
        </label>
        <GooglePlacesAutocomplete
          placeholder="Search for a venue on Google Maps..."
          className="input"
          onPlaceSelect={place => {
            setName(place.name);
            setAddress(place.address);
            setCity(place.city);
            setState(place.state);
            setPostalCode(place.postalCode);
            setCountry(place.country);
            setGooglePlaceId(place.placeId);
            // Auto-populate additional fields if available
            if (place.website) {
              setWebsite(place.website);
            }
            if (place.phone) {
              setPhone(place.phone);
            }
            if (place.description) {
              setDescription(place.description);
            }
            // Auto-generate Google Reviews link from Place ID
            if (place.placeId) {
              setGoogleReviewsLink(
                `https://www.google.com/maps/place/?q=place_id:${place.placeId}`,
              );
            }
            // Note: Photos are available in place.photos but would need to be
            // downloaded from Google and uploaded to S3 to use them
          }}
        />
        <p className="text-xs text-gray-500 mt-1">
          Start typing to search for your venue on Google Maps
        </p>
      </div>

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
            className="select"
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
            disabled
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
        <button
          type="button"
          className="btn btn-light"
          onClick={() => {
            setName('');
            setAddress('');
            setCity('');
            setState('');
            setPostalCode('');
            setCountry('');
            setOpenMic(false);
            setBio('');
            setDescription('');
            setGoogleReviewsLink('');
            setGooglePlaceId('');
            setWebsite('');
            setPhone('');
            setEmail('');
            setVenueImages([]);
            setLogoImage([]);
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
