import React, { useEffect, useRef, useState } from 'react';

interface GooglePlacesAutocompleteProps {
  onPlaceSelect: (place: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    placeId: string;
    formattedAddress: string;
    website?: string;
    phone?: string;
    description?: string;
    photos?: Array<{ photoReference: string; width: number; height: number }>;
    rating?: number;
    userRatingCount?: number;
  }) => void;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export const GooglePlacesAutocomplete: React.FC<
  GooglePlacesAutocompleteProps
> = ({
  onPlaceSelect,
  value = '',
  onChange,
  placeholder = 'Search for a venue...',
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    // Load Google Maps script if not already loaded
    if (window.google?.maps?.places) {
      setIsLoaded(true);
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn(
        'Google Maps API key not found. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file.',
      );
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Google Maps API');
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(
          autocompleteRef.current,
        );
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || !window.google?.maps?.places) {
      return;
    }

    // Initialize autocomplete
    // Note: Autocomplete shows a deprecation warning but still works.
    // Google recommends PlaceAutocompleteElement but it requires a web component approach.
    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'address_components',
          'geometry',
          'website',
          'international_phone_number',
          'editorial_summary',
          'photos',
          'rating',
          'user_ratings_total',
        ],
        types: ['establishment'],
      },
    );

    autocompleteRef.current = autocomplete;

    // Handle place selection
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      if (!place.address_components || !place.place_id) {
        return;
      }

      // Parse address components
      let streetNumber = '';
      let route = '';
      let city = '';
      let state = '';
      let postalCode = '';
      let country = '';

      place.address_components.forEach((component: any) => {
        const types = component.types;
        if (types.includes('street_number')) {
          streetNumber = component.long_name;
        }
        if (types.includes('route')) {
          route = component.long_name;
        }
        if (types.includes('locality')) {
          city = component.long_name;
        }
        if (types.includes('administrative_area_level_1')) {
          state = component.short_name;
        }
        if (types.includes('postal_code')) {
          postalCode = component.long_name;
        }
        if (types.includes('country')) {
          country = component.long_name;
        }
      });

      const address = [streetNumber, route].filter(Boolean).join(' ');

      // Extract photos
      const photos =
        place.photos?.map((photo: any) => ({
          photoReference: photo.photo_reference,
          width: photo.width,
          height: photo.height,
        })) || [];

      onPlaceSelect({
        name: place.name || '',
        address: address || place.formatted_address || '',
        city,
        state,
        postalCode,
        country,
        placeId: place.place_id,
        formattedAddress: place.formatted_address || '',
        website: place.website || undefined,
        phone: place.international_phone_number || undefined,
        description: place.editorial_summary?.overview || undefined,
        photos: photos.length > 0 ? photos : undefined,
        rating: place.rating || undefined,
        userRatingCount: place.user_ratings_total || undefined,
      });
    });

    return () => {
      if (autocomplete) {
        window.google?.maps?.event?.clearInstanceListeners(autocomplete);
      }
    };
  }, [isLoaded, onPlaceSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      placeholder={placeholder}
      className={className}
    />
  );
};
