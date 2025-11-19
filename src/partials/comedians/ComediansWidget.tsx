import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { listComedians } from '@/graphql/queries';
import type { Comedian } from '@/API';
import { KeenIcon } from '@/components';
import { getPublicUrl } from '@/lib/storage';

const client = generateClient({ authMode: 'userPool' });

interface ComediansWidgetProps {
  limit?: number;
  showHeader?: boolean;
  className?: string;
  featured?: boolean;
}

const ComediansWidget = ({
  limit = 8,
  showHeader = true,
  className = '',
  featured = false,
}: ComediansWidgetProps) => {
  const [comedians, setComedians] = useState<Comedian[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileImageUrls, setProfileImageUrls] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const fetchComedians = async () => {
      try {
        setLoading(true);
        const result = await client.graphql({
          query: (listComedians as string).replace(/__typename/g, ''),
          variables: { limit: 100 },
        });

        if ('data' in result && result.data?.listComedians?.items) {
          let items = result.data.listComedians.items.filter(
            (item: Comedian | null): item is Comedian => item !== null,
          );

          // Filter by featured if requested
          if (featured) {
            items = items.filter((comedian: Comedian) => comedian.isFeatured);
          }

          // Sort by verification and featured status, then by name
          items.sort((a: Comedian, b: Comedian) => {
            if (a.isFeatured !== b.isFeatured) {
              return a.isFeatured ? -1 : 1;
            }
            if (a.isVerified !== b.isVerified) {
              return a.isVerified ? -1 : 1;
            }
            return a.stageName.localeCompare(b.stageName);
          });

          // Limit results
          const limitedItems = items.slice(0, limit);
          setComedians(limitedItems);

          // Fetch profile images
          const imageUrls: Record<string, string> = {};
          for (const comedian of limitedItems) {
            if (comedian.profileImageKey) {
              try {
                const url = await getPublicUrl(comedian.profileImageKey);
                imageUrls[comedian.id] = url.toString();
              } catch (error) {
                console.error(
                  `Error fetching image for comedian ${comedian.id}:`,
                  error,
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

    fetchComedians();
  }, [limit, featured]);

  if (loading) {
    return (
      <div className={`card ${className}`}>
        {showHeader && (
          <div className="card-header">
            <h3 className="card-title">Featured Comedians</h3>
          </div>
        )}
        <div className="card-body flex items-center justify-center py-20">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (comedians.length === 0) {
    return (
      <div className={`card ${className}`}>
        {showHeader && (
          <div className="card-header">
            <h3 className="card-title">Featured Comedians</h3>
          </div>
        )}
        <div className="card-body flex flex-col items-center justify-center py-20 text-center">
          <KeenIcon
            icon="microphone-2"
            className="text-4xl text-gray-400 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Comedians Yet
          </h3>
          <p className="text-gray-600">
            Check back soon to discover amazing comedians!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`card ${className}`}>
      {showHeader && (
        <div className="card-header">
          <h3 className="card-title">
            {featured ? 'Featured Comedians' : 'Comedians'}
          </h3>
          <Link
            to="/comedians"
            className="btn btn-sm btn-light hover:btn-primary"
          >
            View All
          </Link>
        </div>
      )}
      <div className="card-body">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {comedians.map(comedian => (
            <Link
              key={comedian.id}
              to={`/comedians/${comedian.id}`}
              className="card card-hover group"
            >
              <div className="card-body flex flex-col items-center text-center p-5">
                {/* Profile Image */}
                <div className="relative mb-3">
                  {profileImageUrls[comedian.id] ? (
                    <div className="size-20 rounded-full overflow-hidden bg-gray-100">
                      <img
                        src={profileImageUrls[comedian.id]}
                        alt={comedian.stageName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {comedian.stageName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {comedian.isVerified && (
                    <div className="absolute bottom-0 right-0 size-5 rounded-full bg-success flex items-center justify-center border-2 border-white">
                      <KeenIcon icon="check" className="text-white text-2xs" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary mb-1 line-clamp-1">
                  {comedian.stageName}
                </h4>

                {/* Location */}
                {comedian.basedIn && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                    <KeenIcon icon="geolocation" className="text-2xs" />
                    <span className="line-clamp-1">{comedian.basedIn}</span>
                  </div>
                )}

                {/* Comedy Styles */}
                {comedian.comedyStyles && comedian.comedyStyles.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {comedian.comedyStyles.slice(0, 2).map((style, idx) => (
                      <span
                        key={idx}
                        className="badge badge-xs badge-light text-2xs"
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export { ComediansWidget, type ComediansWidgetProps };
