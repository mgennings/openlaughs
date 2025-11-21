import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { KeenIcon } from '@/components';
import {
  createShowRSVP,
  updateShowRSVP,
  deleteShowRSVP,
} from '@/graphql/mutations';
import { listShowRSVPS } from '@/graphql/queries';
import type { ShowRSVP } from '@/API';
import { useUserProfile } from '@/hooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const client = generateClient({ authMode: 'userPool' });

interface RSVPButtonProps {
  showId: string;
  onRSVPChange?: (status: string | null) => void;
  variant?: 'button' | 'compact';
  showCount?: boolean;
  className?: string;
}

type RSVPStatus = 'interested' | 'going' | 'attended' | null;

const RSVP_OPTIONS = [
  {
    value: 'going',
    label: "I'm Going",
    icon: 'check-circle',
    color: 'success',
  },
  { value: 'interested', label: 'Interested', icon: 'star', color: 'warning' },
  { value: 'attended', label: 'Attended', icon: 'verify', color: 'primary' },
];

const RSVPButton = ({
  showId,
  onRSVPChange,
  variant = 'button',
  showCount = false,
  className,
}: RSVPButtonProps) => {
  const { profile, loading: profileLoading } = useUserProfile();
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>(null);
  const [rsvpId, setRsvpId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(0);

  useEffect(() => {
    const checkRSVP = async () => {
      if (!profile?.id) return;

      try {
        const result = await client.graphql({
          query: listShowRSVPS,
          variables: {
            filter: {
              userProfileId: { eq: profile.id },
              showId: { eq: showId },
            },
          },
        });

        const rsvps = result.data.listShowRSVPS.items.filter(
          Boolean,
        ) as ShowRSVP[];

        if (rsvps.length > 0) {
          setRsvpStatus(rsvps[0].status as RSVPStatus);
          setRsvpId(rsvps[0].id);
        }

        if (showCount) {
          const countResult = await client.graphql({
            query: listShowRSVPS,
            variables: {
              filter: {
                showId: { eq: showId },
                status: { eq: 'going' },
              },
            },
          });
          setRsvpCount(countResult.data.listShowRSVPS.items.length);
        }
      } catch (error) {
        console.error('Error checking RSVP status:', error);
      }
    };

    void checkRSVP();
  }, [profile?.id, showId, showCount]);

  const handleSetRSVP = async (status: string) => {
    if (!profile?.id || isLoading) return;

    setIsLoading(true);

    try {
      if (rsvpId) {
        // Update existing RSVP
        await client.graphql({
          query: updateShowRSVP,
          variables: {
            input: {
              id: rsvpId,
              status,
            },
          },
        });
      } else {
        // Create new RSVP
        const result = await client.graphql({
          query: createShowRSVP,
          variables: {
            input: {
              userProfileId: profile.id,
              showId,
              status,
            },
          },
        });

        const newRsvp = result.data.createShowRSVP as ShowRSVP;
        setRsvpId(newRsvp.id);
      }

      setRsvpStatus(status as RSVPStatus);
      onRSVPChange?.(status);
    } catch (error) {
      console.error('Error setting RSVP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveRSVP = async () => {
    if (!rsvpId || isLoading) return;

    setIsLoading(true);

    try {
      await client.graphql({
        query: deleteShowRSVP,
        variables: {
          input: {
            id: rsvpId,
          },
        },
      });

      setRsvpStatus(null);
      setRsvpId(null);
      onRSVPChange?.(null);
    } catch (error) {
      console.error('Error removing RSVP:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (profileLoading) {
    return null;
  }

  if (!profile) {
    return null;
  }

  const currentOption = RSVP_OPTIONS.find(opt => opt.value === rsvpStatus);

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            disabled={isLoading}
            className={`flex items-center gap-1.5 text-sm ${
              rsvpStatus
                ? `text-${currentOption?.color}`
                : 'text-gray-700 hover:text-primary'
            } ${isLoading ? 'opacity-50' : ''}`}
          >
            <KeenIcon
              icon={currentOption?.icon || 'calendar-add'}
              className="text-base"
            />
            <span>{currentOption?.label || 'RSVP'}</span>
            {showCount && rsvpCount > 0 && (
              <span className="text-gray-500">({rsvpCount})</span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {RSVP_OPTIONS.map(option => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSetRSVP(option.value)}
              className="flex items-center gap-2"
            >
              <KeenIcon icon={option.icon} className={`text-${option.color}`} />
              {option.label}
              {rsvpStatus === option.value && (
                <KeenIcon icon="check" className="ml-auto" />
              )}
            </DropdownMenuItem>
          ))}
          {rsvpStatus && (
            <>
              <div className="border-t my-1" />
              <DropdownMenuItem
                onClick={handleRemoveRSVP}
                className="flex items-center gap-2 text-danger"
              >
                <KeenIcon icon="trash" />
                Remove RSVP
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={isLoading}
          className={`btn ${
            rsvpStatus ? `btn-${currentOption?.color}` : 'btn-primary'
          } ${isLoading ? 'opacity-50' : ''} ${className}`}
        >
          <KeenIcon
            icon={currentOption?.icon || 'calendar-add'}
            className={rsvpStatus ? 'text-white' : '' + ' me-2'}
          />
          {currentOption?.label || 'RSVP'}
          {showCount && rsvpCount > 0 && (
            <span className="badge badge-sm bg-white/20 ml-2">{rsvpCount}</span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {RSVP_OPTIONS.map(option => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSetRSVP(option.value)}
            className="flex items-center gap-2"
          >
            <KeenIcon icon={option.icon} className={`text-${option.color}`} />
            {option.label}
            {rsvpStatus === option.value && (
              <KeenIcon icon="check" className="ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
        {rsvpStatus && (
          <>
            <div className="border-t my-1" />
            <DropdownMenuItem
              onClick={handleRemoveRSVP}
              className="flex items-center gap-2 text-danger"
            >
              <KeenIcon icon="trash" />
              Remove RSVP
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { RSVPButton };
