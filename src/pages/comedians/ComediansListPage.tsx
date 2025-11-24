import { Fragment, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
} from '@/layouts/demo1/toolbar';
import { KeenIcon } from '@/components';
import { generateClient } from 'aws-amplify/api';
import { listComedians } from '@/graphql/queries';
import type { Comedian } from '@/API';
import { ModalCreateComedian } from './ModalCreateComedian';
import { useAuthContext } from '@/auth/useAuthContext';
import { getPublicUrl } from '@/lib/storage';

const client = generateClient({ authMode: 'userPool' });

const ComediansListPage = () => {
  const { currentUser } = useAuthContext();
  const [comedians, setComedians] = useState<Comedian[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [profileImageUrls, setProfileImageUrls] = useState<
    Record<string, string>
  >({});
  const [expandedStyles, setExpandedStyles] = useState<Set<string>>(new Set());

  const createdBy = useMemo(
    () => currentUser?.email || currentUser?.username || '',
    [currentUser?.email, currentUser?.username],
  );

  const toggleStylesExpanded = (comedianId: string) => {
    setExpandedStyles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(comedianId)) {
        newSet.delete(comedianId);
      } else {
        newSet.add(comedianId);
      }
      return newSet;
    });
  };

  const fetchComedians = async () => {
    try {
      setLoading(true);
      const result = await client.graphql({
        query: (listComedians as string).replace(/__typename/g, ''),
      });

      if ('data' in result && result.data?.listComedians?.items) {
        const items = result.data.listComedians.items.filter(
          (item: Comedian | null): item is Comedian => item !== null,
        );
        setComedians(items);

        // Fetch profile images
        const imageUrls: Record<string, string> = {};
        for (const comedian of items) {
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
    } catch (error) {
      console.error('Error fetching comedians:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComedians();
  }, []);

  const filteredComedians = comedians.filter(
    comedian =>
      comedian.stageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comedian.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comedian.basedIn?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getYearsExperience = (performingSince?: number | null) => {
    if (!performingSince) return null;
    const years = new Date().getFullYear() - performingSince;
    return years > 0 ? `${years} years` : 'Less than a year';
  };

  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading
            title="Comedians"
            description="Manage comedian profiles and directory"
          />
        </Toolbar>
      </Container>

      <Container>
        <div className="grid lg:grid-cols-1 gap-4 lg:gap-7.5">
          <div className="flex items-center justify-between mb-5 gap-2">
            <button
              className="btn btn-sm btn-primary whitespace-nowrap"
              onClick={() => setShowCreateModal(true)}
            >
              <KeenIcon icon="plus" className="me-2" />
              Add Comedian
            </button>
            <div className="flex items-center gap-2">
              <div className="relative">
                <KeenIcon
                  icon="magnifier"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Search comedians..."
                  className="input input-sm pl-10"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="md:h-full">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : filteredComedians.length === 0 ? (
              <div className="text-center py-20">
                <KeenIcon
                  icon="microphone-2"
                  className="text-6xl text-gray-300 mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {searchQuery ? 'No comedians found' : 'No comedians yet'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery
                    ? 'Try adjusting your search'
                    : 'Add your first comedian to get started'}
                </p>
                {!searchQuery && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <KeenIcon icon="plus" className="me-2" />
                    Add Comedian
                  </button>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredComedians.map(comedian => (
                  <Link
                    key={comedian.id}
                    to={`/comedians/${comedian.id}`}
                    className="card card-hover group"
                  >
                    <div className="card-body flex flex-col items-center text-center p-6">
                      {/* Profile Image */}
                      <div className="relative mb-4">
                        {profileImageUrls[comedian.id] ? (
                          <div className="size-24 rounded-full overflow-hidden bg-gray-100">
                            <img
                              src={profileImageUrls[comedian.id]}
                              alt={comedian.stageName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-3xl font-bold text-primary">
                              {comedian.stageName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        {comedian.isVerified && (
                          <div className="absolute bottom-0 right-0 size-6 rounded-full bg-success flex items-center justify-center border-2 border-white">
                            <KeenIcon
                              icon="check"
                              className="text-white text-xs"
                            />
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <h4 className="text-lg font-semibold text-gray-900 group-hover:text-primary mb-1">
                        {comedian.stageName}
                      </h4>

                      {/* Location */}
                      {comedian.basedIn && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                          <KeenIcon icon="geolocation" className="text-xs" />
                          {comedian.basedIn}
                        </div>
                      )}

                      {/* Comedy Styles */}
                      {comedian.comedyStyles &&
                        comedian.comedyStyles.length > 0 && (
                          <div className="flex flex-wrap gap-1 justify-center mb-3">
                            {(expandedStyles.has(comedian.id)
                              ? comedian.comedyStyles
                              : comedian.comedyStyles.slice(0, 2)
                            ).map((style, idx) => (
                              <span
                                key={idx}
                                className="badge badge-sm badge-light"
                              >
                                {style}
                              </span>
                            ))}
                            {comedian.comedyStyles.length > 2 && (
                              <button
                                onClick={e => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleStylesExpanded(comedian.id);
                                }}
                                className={
                                  expandedStyles.has(comedian.id)
                                    ? 'badge badge-xs badge-primary hover:badge-primary-active cursor-pointer transition-colors'
                                    : 'badge badge-sm badge-light hover:badge-primary cursor-pointer transition-colors'
                                }
                              >
                                {expandedStyles.has(comedian.id)
                                  ? 'Show less'
                                  : `+${comedian.comedyStyles.length - 2}`}
                              </button>
                            )}
                          </div>
                        )}

                      {/* Bio Preview */}
                      {comedian.bio && (
                        <p
                          title={comedian.bio}
                          className="text-xs md:text-sm text-gray-600 line-clamp-4 mb-3 min-h-[64px] md:min-h-[80px]"
                        >
                          {comedian.bio}
                        </p>
                      )}

                      {/* Experience */}
                      {comedian.performingSince && (
                        <div className="text-xs text-gray-500">
                          {getYearsExperience(comedian.performingSince)}{' '}
                          experience
                        </div>
                      )}

                      {/* Status Indicators */}
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 w-full justify-center">
                        {comedian.isActive && (
                          <span className="badge badge-sm badge-success">
                            Active
                          </span>
                        )}
                        {comedian.isFeatured && (
                          <span className="badge badge-sm badge-warning">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Create Comedian Modal */}
      <ModalCreateComedian
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        createdBy={createdBy}
        onCreated={() => fetchComedians()}
        onError={message => setError(message)}
      />

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger mb-6">
          <span>{error}</span>
        </div>
      )}
    </Fragment>
  );
};

export { ComediansListPage };
