import { useState, useEffect } from 'react';
import { KeenIcon } from '@/components';
import { ComedianLinkForm } from '@/pages/comedians/ComedianLinkForm';
import { useUserProfile } from '@/hooks';
import { generateClient } from 'aws-amplify/api';
import { listComedians, getComedian } from '@/graphql/queries';
import { updateComedian } from '@/graphql/mutations';
import type { Comedian, UpdateComedianInput } from '@/API';
import { getPublicUrl } from '@/lib/storage';
import { Link } from 'react-router-dom';

const client = generateClient({ authMode: 'userPool' });

const ComedianProfile = () => {
  const { profile } = useUserProfile();
  const [linkedComedian, setLinkedComedian] = useState<Comedian | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [unlinking, setUnlinking] = useState(false);

  useEffect(() => {
    const fetchLinkedComedian = async () => {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      try {
        const result = await client.graphql({
          query: (listComedians as string).replace(/__typename/g, ''),
          variables: {
            filter: {
              userProfileId: { eq: profile.id },
            },
            limit: 1,
          },
        });

        if ('data' in result && result.data?.listComedians?.items) {
          const items = result.data.listComedians.items.filter(
            (item: Comedian | null): item is Comedian => item !== null,
          );
          if (items.length > 0) {
            const comedian = items[0];
            setLinkedComedian(comedian);

            // Load profile image
            if (comedian.profileImageKey) {
              try {
                const url = await getPublicUrl(comedian.profileImageKey);
                setProfileImageUrl(url.toString());
              } catch (err) {
                console.error('Error loading comedian image:', err);
              }
            }
          }
        }
      } catch (err) {
        console.error('Error fetching linked comedian:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLinkedComedian();
  }, [profile?.id]);

  const handleComedianLinked = async (comedianId: string) => {
    // Refresh the linked comedian
    try {
      const result = await client.graphql({
        query: (getComedian as string).replace(/__typename/g, ''),
        variables: { id: comedianId },
      });

      if ('data' in result && result.data?.getComedian) {
        const comedian = result.data.getComedian as Comedian;
        setLinkedComedian(comedian);
        setShowLinkForm(false);

        // Load profile image
        if (comedian.profileImageKey) {
          try {
            const url = await getPublicUrl(comedian.profileImageKey);
            setProfileImageUrl(url.toString());
          } catch (err) {
            console.error('Error loading comedian image:', err);
          }
        }
      }
    } catch (err) {
      console.error('Error refreshing linked comedian:', err);
    }
  };

  const handleUnlink = async () => {
    if (!linkedComedian || unlinking) return;

    if (
      !confirm(
        'Are you sure you want to unlink this comedian profile? You can link it again later.',
      )
    ) {
      return;
    }

    setUnlinking(true);
    try {
      const input: UpdateComedianInput = {
        id: linkedComedian.id,
        userProfileId: null,
      };

      await client.graphql({
        query: (updateComedian as string).replace(/__typename/g, ''),
        variables: { input },
      });

      setLinkedComedian(null);
      setProfileImageUrl(null);
    } catch (err: any) {
      console.error('Error unlinking comedian:', err);
      alert('Failed to unlink comedian profile. Please try again.');
    } finally {
      setUnlinking(false);
    }
  };

  if (loading) {
    return (
      <div className="card min-w-full">
        <div className="card-header">
          <h3 className="card-title">Comedian Profile</h3>
        </div>
        <div className="card-body">
          <div className="text-center py-4">
            <span className="spinner-border spinner-border-sm text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card min-w-full">
      <div className="card-header">
        <h3 className="card-title">Comedian Profile</h3>
        {linkedComedian && (
          <div className="flex items-center gap-2 ml-auto">
            <Link
              to={`/comedians/${linkedComedian.id}`}
              className="btn btn-sm btn-light"
            >
              <KeenIcon icon="eye" className="me-1" />
              View Profile
            </Link>
            <Link
              to={`/comedians/${linkedComedian.id}`}
              className="btn btn-sm btn-primary"
            >
              <KeenIcon icon="pencil" className="me-1" />
              Edit Profile
            </Link>
          </div>
        )}
      </div>
      <div className="card-body">
        {showLinkForm ? (
          <div className="space-y-4">
            <ComedianLinkForm
              userProfileId={profile?.id || ''}
              userFirstName={profile?.firstName}
              userLastName={profile?.lastName}
              onLinked={handleComedianLinked}
              mode="profile"
            />
            <button
              onClick={() => setShowLinkForm(false)}
              className="btn btn-sm btn-light"
            >
              Cancel
            </button>
          </div>
        ) : linkedComedian ? (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt={linkedComedian.stageName}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
                  <KeenIcon icon="user" className="text-3xl text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">
                  {linkedComedian.stageName}
                </h4>
                {(linkedComedian.firstName || linkedComedian.lastName) && (
                  <p className="text-sm text-gray-600">
                    {[linkedComedian.firstName, linkedComedian.lastName]
                      .filter(Boolean)
                      .join(' ')}
                  </p>
                )}
                {linkedComedian.basedIn && (
                  <p className="text-xs text-gray-500 mt-1">
                    Based in {linkedComedian.basedIn}
                  </p>
                )}
                {linkedComedian.headline && (
                  <p className="text-sm text-gray-700 mt-2">
                    {linkedComedian.headline}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 pt-4 border-t">
              <button
                onClick={handleUnlink}
                disabled={unlinking}
                className="btn btn-sm btn-light"
              >
                {unlinking ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Unlinking...
                  </>
                ) : (
                  <>
                    <KeenIcon icon="cross" className="me-1" />
                    Unlink Profile
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <KeenIcon icon="user" className="text-5xl text-gray-300 mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No Comedian Profile Linked
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Link your existing comedian profile or create a new one to get
              started.
            </p>
            <button
              onClick={() => setShowLinkForm(true)}
              className="btn btn-primary"
            >
              <KeenIcon icon="plus" className="me-2" />
              Link Comedian Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { ComedianProfile };
