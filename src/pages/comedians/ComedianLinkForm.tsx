import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listComedians } from '@/graphql/queries';
import { createComedian, updateComedian } from '@/graphql/mutations';
import type { Comedian, CreateComedianInput, UpdateComedianInput } from '@/API';
import { KeenIcon, Alert } from '@/components';
import { ImageInput, type TImageInputFiles } from '@/components/image-input';
import { uploadPublicImage, getPublicUrl } from '@/lib/storage';
import {
  validateSocialMediaUsername,
  cleanSocialMediaInput,
} from '@/utils/socialMedia';
import {
  validatePhoneNumber,
  validateEmail,
  formatPhoneInput,
  cleanPhoneNumber,
  cleanEmail,
} from '@/utils/validation';
import {
  COMEDY_STYLES,
  PERFORMANCE_TYPES,
  CONTENT_RATINGS,
  COMEDIAN_AVAILABILITY_OPTIONS,
} from '@/config/constants';
import { ModalCreateComedian } from './ModalCreateComedian';

const client = generateClient({ authMode: 'userPool' });

interface ComedianLinkFormProps {
  userProfileId: string;
  userFirstName?: string | null;
  userLastName?: string | null;
  onLinked?: (comedianId: string) => void;
  onError?: (message: string) => void;
  mode?: 'onboarding' | 'profile'; // Different UI for onboarding vs profile edit
}

const ComedianLinkForm = ({
  userProfileId,
  userFirstName,
  userLastName,
  onLinked,
  onError,
  mode = 'onboarding',
}: ComedianLinkFormProps) => {
  const [step, setStep] = useState<'search' | 'create'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Comedian[]>([]);
  const [searching, setSearching] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-search when user types (debounced)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    setError(null);

    try {
      // Fetch comedians and filter client-side for case-insensitive search
      const result = await client.graphql({
        query: (listComedians as string).replace(/__typename/g, ''),
        variables: {
          limit: 100, // Fetch more to search through
        },
      });

      if ('data' in result && result.data?.listComedians?.items) {
        const items = result.data.listComedians.items.filter(
          (item: Comedian | null): item is Comedian => item !== null,
        );

        // Case-insensitive search across stageName, firstName, lastName
        const queryLower = query.toLowerCase();
        const filtered = items.filter(
          (comedian: Comedian) =>
            comedian.stageName.toLowerCase().includes(queryLower) ||
            comedian.firstName?.toLowerCase().includes(queryLower) ||
            comedian.lastName?.toLowerCase().includes(queryLower),
        );

        // Limit to 20 results
        setSearchResults(filtered.slice(0, 20));
      } else {
        setSearchResults([]);
      }
    } catch (err: any) {
      console.error('Error searching comedians:', err);
      setError('Failed to search comedians. Please try again.');
      onError?.(err.message || 'Failed to search comedians');
    } finally {
      setSearching(false);
    }
  };

  const handleLinkComedian = async (comedian: Comedian) => {
    if (linking) return;

    // Check if comedian is already linked to someone else
    if (comedian.userProfileId && comedian.userProfileId !== userProfileId) {
      setError(
        'This comedian profile is already linked to another account. Please create a new profile or contact support.',
      );
      onError?.('Comedian already linked to another account');
      return;
    }

    setLinking(true);
    setError(null);

    try {
      const input: UpdateComedianInput = {
        id: comedian.id,
        userProfileId: userProfileId,
      };

      const result = await client.graphql({
        query: (updateComedian as string).replace(/__typename/g, ''),
        variables: { input },
      });

      if ('errors' in result && result.errors) {
        throw new Error(result.errors[0].message);
      }

      onLinked?.(comedian.id);
    } catch (err: any) {
      console.error('Error linking comedian:', err);
      const errorMessage = err.message || 'Failed to link comedian profile';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLinking(false);
    }
  };

  const handleCreateNew = () => {
    setShowCreateModal(true);
    setError(null);
  };

  const handleComedianCreated = async (comedianId?: string) => {
    setShowCreateModal(false);

    if (comedianId) {
      // Link the newly created comedian to the user
      try {
        setLinking(true);
        const input: UpdateComedianInput = {
          id: comedianId,
          userProfileId: userProfileId,
        };

        await client.graphql({
          query: (updateComedian as string).replace(/__typename/g, ''),
          variables: { input },
        });

        onLinked?.(comedianId);
      } catch (err: any) {
        console.error('Error linking newly created comedian:', err);
        setError(
          'Comedian created but failed to link. Please contact support.',
        );
        onError?.('Failed to link comedian');
      } finally {
        setLinking(false);
      }
    } else {
      // If no ID returned, refresh search to find the newly created comedian
      if (searchQuery) {
        await performSearch(searchQuery);
      }
    }
  };

  // Pre-fill search with user's name if available
  useEffect(() => {
    if (
      mode === 'onboarding' &&
      !searchQuery &&
      (userFirstName || userLastName)
    ) {
      const nameQuery = [userFirstName, userLastName].filter(Boolean).join(' ');
      if (nameQuery) {
        setSearchQuery(nameQuery);
      }
    }
  }, [mode, userFirstName, userLastName]);

  return (
    <>
      <ModalCreateComedian
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        createdBy={userProfileId}
        onCreated={handleComedianCreated}
        onError={onError}
      />
      <div className="space-y-6">
        {error && <Alert variant="danger">{error}</Alert>}

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {mode === 'onboarding'
              ? 'Link Your Comedian Profile'
              : 'Link Comedian Profile'}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {mode === 'onboarding'
              ? 'Search for your existing comedian profile or create a new one to get started.'
              : 'Search for an existing comedian profile to link to your account, or create a new one.'}
          </p>
        </div>

        {/* Search Input */}
        <div>
          <label className="form-label">
            Search by Stage Name, First Name, or Last Name
          </label>
          <div className="relative">
            <input
              type="text"
              className="input pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="e.g., John Doe or Stage Name"
            />
            <KeenIcon
              icon="magnifier"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            {searching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="spinner-border spinner-border-sm text-primary" />
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">
              Found {searchResults.length} comedian
              {searchResults.length !== 1 ? 's' : ''}
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map(comedian => {
                const isLinked = comedian.userProfileId === userProfileId;
                const isLinkedToOther =
                  comedian.userProfileId &&
                  comedian.userProfileId !== userProfileId;

                return (
                  <div
                    key={comedian.id}
                    className={`card p-4 ${
                      comedian.userProfileId === userProfileId
                        ? 'ring-2 ring-primary'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-semibold text-gray-900">
                            {comedian.stageName}
                          </h5>
                          {isLinked && (
                            <span className="badge badge-sm badge-success">
                              Linked
                            </span>
                          )}
                          {isLinkedToOther && (
                            <span className="badge badge-sm badge-warning">
                              Linked to Another Account
                            </span>
                          )}
                        </div>
                        {(comedian.firstName || comedian.lastName) && (
                          <p className="text-sm text-gray-600">
                            {[comedian.firstName, comedian.lastName]
                              .filter(Boolean)
                              .join(' ')}
                          </p>
                        )}
                        {comedian.basedIn && (
                          <p className="text-xs text-gray-500 mt-1">
                            Based in {comedian.basedIn}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {isLinked ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            disabled
                          >
                            <KeenIcon icon="check" className="me-1" />
                            Linked
                          </button>
                        ) : isLinkedToOther ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-light"
                            disabled
                          >
                            Unavailable
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => handleLinkComedian(comedian)}
                            disabled={linking}
                          >
                            {linking ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Linking...
                              </>
                            ) : (
                              <>
                                <KeenIcon icon="link" className="me-1" />
                                Link Profile
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {searchQuery && !searching && searchResults.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              No comedian profiles found matching "{searchQuery}"
            </p>
            <button
              type="button"
              onClick={handleCreateNew}
              className="btn btn-primary"
            >
              <KeenIcon icon="plus" className="me-2" />
              Create New Comedian Profile
            </button>
          </div>
        )}

        {!searchQuery && (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Start typing to search for your comedian profile, or create a new
              one.
            </p>
            <button
              type="button"
              onClick={handleCreateNew}
              className="btn btn-primary"
            >
              <KeenIcon icon="plus" className="me-2" />
              Create New Comedian Profile
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export { ComedianLinkForm };
