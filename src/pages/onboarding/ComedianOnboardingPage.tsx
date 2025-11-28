import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/container';
import { KeenIcon, Alert } from '@/components';
import { ComedianLinkForm } from '@/pages/comedians/ComedianLinkForm';
import { useUserProfile } from '@/hooks';
import { generateClient } from 'aws-amplify/api';
import { listComedians } from '@/graphql/queries';
import type { Comedian } from '@/API';

const client = generateClient({ authMode: 'userPool' });

const ComedianOnboardingPage = () => {
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useUserProfile();
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [existingComedian, setExistingComedian] = useState<Comedian | null>(
    null,
  );

  // Check if user already has a linked comedian
  useEffect(() => {
    const checkExistingComedian = async () => {
      if (!profile?.id) {
        setCheckingExisting(false);
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
            setExistingComedian(items[0]);
          }
        }
      } catch (err) {
        console.error('Error checking existing comedian:', err);
      } finally {
        setCheckingExisting(false);
      }
    };

    if (!profileLoading) {
      checkExistingComedian();
    }
  }, [profile?.id, profileLoading]);

  const handleComedianLinked = (comedianId: string) => {
    // Redirect to dashboard after successful linking
    navigate('/dashboard', { replace: true });
  };

  const handleSkip = () => {
    // Allow skipping for now - they can link later from profile page
    navigate('/dashboard', { replace: true });
  };

  if (profileLoading || checkingExisting) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Container className="max-w-2xl">
          <div className="text-center">
            <span className="spinner-border spinner-border-lg text-primary" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </Container>
      </div>
    );
  }

  // If comedian is already linked, redirect to dashboard
  if (existingComedian) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
        <Container className="max-w-2xl">
          <div className="card text-center">
            <div className="card-body">
              <div className="mb-4">
                <KeenIcon
                  icon="check-circle"
                  className="text-5xl text-success"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Comedian Profile Linked! 🎭
              </h1>
              <p className="text-gray-600 mb-6">
                Your comedian profile "{existingComedian.stageName}" is already
                linked to your account.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <Container className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Set Up Your Comedian Profile 🎤
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Link your existing comedian profile or create a new one to get
            started.
          </p>
        </div>

        <div className="card">
          <div className="card-body">
            <ComedianLinkForm
              userProfileId={profile?.id || ''}
              userFirstName={profile?.firstName}
              userLastName={profile?.lastName}
              onLinked={handleComedianLinked}
              onError={message => {
                console.error('Error:', message);
              }}
              mode="onboarding"
            />
          </div>
        </div>

        <div className="text-center mt-6">
          <button onClick={handleSkip} className="btn btn-light text-sm">
            Skip for now
          </button>
          <p className="text-xs text-gray-500 mt-2">
            You can link your comedian profile later from your account settings.
          </p>
        </div>
      </Container>
    </div>
  );
};

export { ComedianOnboardingPage };
