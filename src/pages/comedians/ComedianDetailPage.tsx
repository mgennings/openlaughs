import { Fragment, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
} from '@/layouts/demo1/toolbar';
import { KeenIcon, FavoriteButton } from '@/components';
import { generateClient } from 'aws-amplify/api';
import { getComedian, listShows } from '@/graphql/queries';
import type { Comedian, Show } from '@/API';
import { getPublicUrl } from '@/lib/storage';
import { ModalUpdateComedian } from './ModalUpdateComedian';
import { getSocialMediaUrl } from '@/utils/socialMedia';

const client = generateClient({ authMode: 'userPool' });

const ComedianDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [comedian, setComedian] = useState<Comedian | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!id) return;

    try {
      setLoading(true);

      // Fetch comedian
      const comedianResult = await client.graphql({
        query: (getComedian as string).replace(/__typename/g, ''),
        variables: { id },
      });

      if ('data' in comedianResult && comedianResult.data?.getComedian) {
        const comedianData = comedianResult.data.getComedian;
        setComedian(comedianData);

        // Fetch profile image if available
        setProfileImageUrl(null); // Reset first
        if (comedianData.profileImageKey) {
          try {
            const url = await getPublicUrl(comedianData.profileImageKey);
            setProfileImageUrl(url.toString());
          } catch (err) {
            console.error('Failed to load profile image:', err);
          }
        }

        // Fetch shows for this comedian
        const showsResult = await client.graphql({
          query: (listShows as string).replace(/__typename/g, ''),
        });

        if ('data' in showsResult && showsResult.data?.listShows?.items) {
          // Filter shows that include this comedian
          const comedianShows = showsResult.data.listShows.items.filter(
            (show: Show | null): show is Show =>
              show !== null && show.comedianIDs?.includes(id) === true,
          );
          setShows(comedianShows);
        }
      }
    } catch (error) {
      console.error('Error fetching comedian:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const getYearsExperience = () => {
    if (!comedian?.performingSince) return null;
    const years = new Date().getFullYear() - comedian.performingSince;
    return years > 0 ? years : 0;
  };

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch {
      return dateTimeString;
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (!comedian) {
    return (
      <Container>
        <div className="card">
          <div className="card-body text-center py-20">
            <KeenIcon
              icon="information-2"
              className="text-6xl text-gray-300 mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Comedian Not Found</h3>
            <Link to="/comedians" className="btn btn-primary mt-4">
              Back to Comedians
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading
            title={comedian.stageName}
            description="Comedian Profile"
          />
          <ToolbarActions>
            {id && <FavoriteButton comedianId={id} showCount />}
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setShowEditModal(true)}
            >
              <KeenIcon icon="pencil" className="me-2" />
              Edit Profile
            </button>
            <Link to="/comedians" className="btn btn-sm btn-light">
              <KeenIcon icon="left" className="me-2" />
              Back to List
            </Link>
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        <div className="grid gap-5 lg:gap-7.5">
          {/* Profile Header Card */}
          <div className="card">
            <div className="card-body">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    {profileImageUrl ? (
                      <div className="size-32 rounded-full overflow-hidden bg-gray-100">
                        <img
                          src={profileImageUrl}
                          alt={comedian.stageName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="size-32 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-5xl font-bold text-primary">
                          {comedian.stageName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {comedian.isVerified && (
                      <div className="absolute bottom-0 right-0 size-10 rounded-full bg-success flex items-center justify-center border-4 border-white">
                        <KeenIcon icon="check" className="text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {comedian.stageName}
                        {comedian.isVerified && (
                          <KeenIcon
                            icon="verify"
                            className="text-success ml-2 text-xl inline-block"
                          />
                        )}
                      </h1>
                      {comedian.headline && (
                        <p className="text-lg text-gray-600 italic">
                          "{comedian.headline}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-6 mb-6">
                    {comedian.basedIn && (
                      <div className="flex items-center gap-2">
                        <KeenIcon
                          icon="geolocation"
                          className="text-gray-500"
                        />
                        <span className="text-gray-700">
                          {comedian.basedIn}
                        </span>
                      </div>
                    )}
                    {comedian.performingSince && (
                      <div className="flex items-center gap-2">
                        <KeenIcon icon="calendar" className="text-gray-500" />
                        <span className="text-gray-700">
                          Since {comedian.performingSince} (
                          {getYearsExperience()} years)
                        </span>
                      </div>
                    )}
                    {comedian.availability && (
                      <div className="flex items-center gap-2">
                        <KeenIcon icon="status" className="text-gray-500" />
                        <span className="text-gray-700">
                          {comedian.availability}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2">
                    {comedian.isActive && (
                      <span className="badge badge-success">Active</span>
                    )}
                    {comedian.isFeatured && (
                      <span className="badge badge-warning">Featured</span>
                    )}
                    {comedian.contentRating && (
                      <span className="badge badge-light">
                        {comedian.contentRating}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          {comedian.bio && (
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">About</h3>
              </div>
              <div className="card-body">
                <p className="text-gray-700 leading-relaxed">{comedian.bio}</p>
              </div>
            </div>
          )}

          {/* Comedy Profile & Social Links */}
          <div className="grid lg:grid-cols-2 gap-5 lg:gap-7.5">
            {/* Comedy Profile */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Comedy Profile</h3>
              </div>
              <div className="card-body space-y-4">
                {comedian.comedyStyles && comedian.comedyStyles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">
                      Comedy Styles
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {comedian.comedyStyles.map((style, idx) => (
                        <span key={idx} className="badge badge-primary">
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {comedian.performanceTypes &&
                  comedian.performanceTypes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-600 mb-2">
                        Performance Types
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {comedian.performanceTypes.map((type, idx) => (
                          <span key={idx} className="badge badge-light">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Social Media & Contact */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Connect</h3>
              </div>
              <div className="card-body space-y-3">
                {comedian.website && (
                  <a
                    href={comedian.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-primary"
                  >
                    <KeenIcon icon="dribbble" />
                    <span>Website</span>
                  </a>
                )}
                {comedian.instagram && (
                  <a
                    href={getSocialMediaUrl('instagram', comedian.instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-primary"
                  >
                    <KeenIcon icon="instagram" />
                    <span>Instagram</span>
                  </a>
                )}
                {comedian.twitter && (
                  <a
                    href={getSocialMediaUrl('twitter', comedian.twitter)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-primary"
                  >
                    <KeenIcon icon="twitter" />
                    <span>Twitter</span>
                  </a>
                )}
                {comedian.tiktok && (
                  <a
                    href={getSocialMediaUrl('tiktok', comedian.tiktok)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-primary"
                  >
                    <KeenIcon icon="tiktok" />
                    <span>TikTok</span>
                  </a>
                )}
                {comedian.youtube && (
                  <a
                    href={getSocialMediaUrl('youtube', comedian.youtube)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-primary"
                  >
                    <KeenIcon icon="youtube" />
                    <span>YouTube</span>
                  </a>
                )}
                {comedian.facebook && (
                  <a
                    href={getSocialMediaUrl('facebook', comedian.facebook)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-primary"
                  >
                    <KeenIcon icon="facebook" />
                    <span>Facebook</span>
                  </a>
                )}
                {comedian.businessEmail && (
                  <a
                    href={`mailto:${comedian.businessEmail}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-primary"
                  >
                    <KeenIcon icon="sms" />
                    <span>Email</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Shows Section */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Shows ({shows.length})</h3>
            </div>
            <div className="card-body">
              {shows.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No shows scheduled yet
                </div>
              ) : (
                <div className="space-y-4">
                  {shows.map(show => (
                    <Link
                      key={show.id}
                      to={`/shows/${show.id}`}
                      className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {show.title}
                        </h4>
                        {show.description && (
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {show.description}
                          </p>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <KeenIcon
                          icon="calendar"
                          className="inline-block mr-1"
                        />
                        {formatDateTime(show.dateTime)}
                      </div>
                      <KeenIcon icon="right" className="text-gray-400" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Edit Modal */}
      {id && (
        <ModalUpdateComedian
          open={showEditModal}
          onOpenChange={setShowEditModal}
          comedianId={id}
          onUpdated={() => fetchData()}
          onError={message => setError(message)}
        />
      )}

      {/* Error Alert */}
      {error && (
        <div
          className="fixed bottom-4 right-4 max-w-md bg-danger text-white p-4 rounded-lg shadow-lg z-50"
          role="alert"
        >
          <div className="flex items-center gap-3">
            <KeenIcon icon="information-2" className="text-2xl" />
            <div className="flex-1">
              <p className="font-semibold mb-1">Error</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-white hover:opacity-80"
              aria-label="Close"
            >
              <KeenIcon icon="cross" />
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export { ComedianDetailPage };
