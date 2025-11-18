import { Link } from 'react-router-dom';

import { KeenIcon } from '@/components';
import { toAbsoluteUrl } from '@/utils/Assets';

interface IWorkProps {
  image: string;
  showImageUrl?: string; // Optional full URL for show image - takes precedence over image
  title: string;
  description?: string;
  dateTime?: string; // Optional date/time string to display
  authorAvatar: string;
  authorAvatarUrl?: string; // Optional full URL - takes precedence over authorAvatar
  authorName: string;
  likes: number;
  comments: number;
  titleLink?: string; // Optional link for the title - if not provided, uses default
}

const CardWork = ({
  image,
  showImageUrl,
  title,
  description,
  dateTime,
  authorAvatar,
  authorAvatarUrl,
  authorName,
  likes,
  comments,
  titleLink,
}: IWorkProps) => {
  const hasAvatarUrl = !!authorAvatarUrl;
  const avatarSrc =
    authorAvatarUrl || toAbsoluteUrl(`/media/avatars/${authorAvatar}`);
  const imageSrc =
    showImageUrl || toAbsoluteUrl(`/media/images/600x400/${image}`);

  // Get first letter for fallback
  const firstLetter = authorName?.charAt(0)?.toUpperCase() || '?';

  const formatDateTime = (dateTimeString?: string) => {
    if (!dateTimeString) return '';
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

  return (
    <div className="card border-0">
      <img src={imageSrc} className="w-full h-auto rounded-t-xl" alt="" />

      <div className="card-border card-rounded-b flex flex-col gap-2 px-5 py-4.5 h-full">
        <Link
          to={titleLink || '/public-profile/profiles/company'}
          className="text-lg font-medium text-gray-900 hover:text-primary"
        >
          {title}
        </Link>

        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        )}

        {dateTime && (
          <div className="text-sm text-gray-700 flex items-center gap-2">
            <KeenIcon icon="calendar" className="text-primary" />
            {formatDateTime(dateTime)}
          </div>
        )}

        <div className="flex items-end justify-between grow">
          <div className="flex items-center grow">
            {hasAvatarUrl ? (
              <img
                src={avatarSrc}
                className="rounded-full size-7 me-2 object-cover"
                alt={authorName}
                onError={e => {
                  // Replace image with letter circle if it fails to load
                  const target = e.target as HTMLImageElement;
                  const fallback = document.createElement('div');
                  fallback.className =
                    'rounded-full size-7 me-2 bg-primary text-white flex items-center justify-center font-semibold text-sm';
                  fallback.textContent = firstLetter;
                  target.replaceWith(fallback);
                }}
              />
            ) : (
              <div className="rounded-full size-7 me-2 bg-primary text-white flex items-center justify-center font-semibold text-sm">
                {firstLetter}
              </div>
            )}

            <Link
              to="/public-profile/profiles/nft"
              className="text-2sm text-gray-800 hover:text-primary mb-px"
            >
              {authorName}
            </Link>
          </div>

          <div className="flex gap-3 items-center">
            <div className="flex gap-1 items-center">
              <KeenIcon icon="heart" className="text-base text-gray-500" />
              <span className="text-2sm text-gray-800 py-2">{likes}</span>
            </div>

            <div className="flex gap-1 items-center">
              <KeenIcon icon="messages" className="text-base text-gray-500" />
              <span className="text-2sm text-gray-800 py-2">{comments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CardWork, type IWorkProps };
