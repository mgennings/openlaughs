import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components/container';
import { KeenIcon, Alert } from '@/components';
import { useAuthContext } from '@/auth';
import { generateClient } from 'aws-amplify/api';
import { createUserProfile } from '@/graphql/mutations';
import { listUserProfiles } from '@/graphql/queries';
import type { CreateUserProfileInput } from '@/API';
import { ROLE_OPTIONS, type UserRole } from '@/config/constants';

const client = generateClient({ authMode: 'userPool' });

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectRole = async (role: UserRole) => {
    if (loading) return;

    setSelectedRole(role);
    setError(null);
    setLoading(true);

    try {
      const userEmail = currentUser?.email;
      if (!userEmail) {
        throw new Error('User email not found. Please sign in again.');
      }

      // Check if UserProfile already exists
      try {
        const existingProfiles = await client.graphql({
          query: (listUserProfiles as string).replace(/__typename/g, ''),
          variables: {
            filter: {
              email: { eq: userEmail },
            },
            limit: 1,
          },
        });

        if (
          'data' in existingProfiles &&
          existingProfiles.data?.listUserProfiles?.items?.length > 0
        ) {
          // Profile exists, redirect to dashboard
          navigate('/dashboard', { replace: true });
          return;
        }
      } catch {
        // Continue to create profile
        console.log('No existing profile found, creating new one');
      }

      // Create UserProfile with selected role and user info from OAuth/Cognito
      const input: CreateUserProfileInput = {
        email: userEmail,
        role: role,
        displayName: currentUser?.fullname || currentUser?.username || '',
        firstName: currentUser?.first_name || '',
        lastName: currentUser?.last_name || '',
      };

      console.log('Creating UserProfile with input:', input);

      const result = await client.graphql({
        query: (createUserProfile as string).replace(/__typename/g, ''),
        variables: { input },
      });

      console.log('GraphQL result:', result);

      // Check for GraphQL errors (GraphQL can return 200 with errors)
      if ('errors' in result && result.errors && result.errors.length > 0) {
        const errorMessages = result.errors
          .map((e: any) => e.message || String(e))
          .join(', ');
        console.error('GraphQL errors:', result.errors);
        throw new Error(errorMessages || 'Failed to create user profile');
      }

      // Verify we got data back
      if (!('data' in result)) {
        throw new Error('GraphQL response missing data field');
      }

      if (!result.data?.createUserProfile) {
        console.error('No createUserProfile in response:', result.data);
        throw new Error(
          'Failed to create user profile - no data returned. Check console for details.',
        );
      }

      console.log(
        'UserProfile created successfully:',
        result.data.createUserProfile,
      );

      // Small delay to ensure profile is available before redirect
      await new Promise(resolve => setTimeout(resolve, 500));

      // If admin, add to Cognito admin group (would need Lambda trigger for this)
      // For now, we'll handle this via the UserProfile role field

      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Onboarding error:', err);

      // Extract more detailed error messages
      let errorMessage =
        'Failed to complete onboarding. Please try again or contact support.';

      if (err.message) {
        errorMessage = err.message;
      } else if (err.errors && Array.isArray(err.errors)) {
        errorMessage = err.errors.map((e: any) => e.message || e).join(', ');
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <Container className="max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to OpenLaughs! 🎭
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Let's get you set up. First, tell us which role best describes you
            in Austin's comedy scene.
          </p>
        </div>

        {error && (
          <div className="mb-8">
            <Alert variant="danger">{error}</Alert>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {ROLE_OPTIONS.map(option => {
            const isSelected = selectedRole === option.role;
            const isLoading = loading && isSelected;

            return (
              <button
                key={option.role}
                onClick={() => handleSelectRole(option.role)}
                disabled={loading}
                className={`
                  group relative card p-8 lg:p-10 text-left
                  transition-all duration-300
                  hover:shadow-xl hover:scale-[1.02]
                  ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''}
                  ${loading && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                  ${isLoading ? 'cursor-wait' : 'cursor-pointer'}
                `}
              >
                <div className="flex flex-col gap-6">
                  {/* Icon and Emoji */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <KeenIcon
                          icon={option.icon}
                          className="text-3xl text-primary"
                        />
                      </div>
                      <span className="text-4xl">{option.emoji}</span>
                    </div>
                    {isLoading && (
                      <div
                        className="spinner-border spinner-border-sm text-primary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                    {isSelected && !isLoading && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <KeenIcon icon="check" className="text-white text-sm" />
                      </div>
                    )}
                  </div>

                  {/* Title and Description */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {option.title}
                    </h3>
                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-xl bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none" />
              </button>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don't worry, you can change your role later in your account
            settings.
          </p>
        </div>
      </Container>
    </div>
  );
};

export { OnboardingPage };
