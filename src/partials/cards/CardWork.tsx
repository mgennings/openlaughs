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
    <div className="card">
      <Link to={titleLink || '/shows/:id'} className="block">
        <img src={imageSrc} className="w-full h-auto rounded-t-xl" alt="" />
      </Link>

      <div className="px-5 py-4.5 mt-auto">
        <Link
          to={titleLink || '/shows/:id'}
          className="text-lg md:text-md font-medium text-gray-900 hover:text-primary"
        >
          {title}
        </Link>

        {description && (
          <p className="text-sm text-gray-600 line-clamp-2 my-2 min-h-[40px]">
            {description}
          </p>
        )}

        {dateTime && (
          <div className="my-4 text-sm text-gray-700 flex items-center gap-2">
            <KeenIcon icon="calendar" className="text-primary" />
            {formatDateTime(dateTime)}
          </div>
        )}

        <div className="flex items-end justify-between grow mt-2">
          <Link
            to={titleLink || '/shows/:id'}
            title={authorName}
            className="flex items-center grow min-w-0 me-2"
          >
            {hasAvatarUrl ? (
              <img
                src={avatarSrc}
                className="rounded-full size-7 me-2 object-cover flex-shrink-0"
                alt={authorName}
                onError={e => {
                  // Replace image with letter circle if it fails to load
                  const target = e.target as HTMLImageElement;
                  const fallback = document.createElement('div');
                  fallback.className =
                    'rounded-full size-7 me-2 bg-primary text-white flex items-center justify-center font-semibold text-sm flex-shrink-0';
                  fallback.textContent = firstLetter;
                  target.replaceWith(fallback);
                }}
              />
            ) : (
              <div className="rounded-full size-7 me-2 bg-primary text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {firstLetter}
              </div>
            )}

            <div
              className="text-2sm text-gray-800 hover:text-primary mb-px line-clamp-1 min-w-0 overflow-hidden text-ellipsis"
              title={authorName}
            >
              {authorName}
            </div>
          </Link>

          <div className="flex gap-3 items-center flex-shrink-0">
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
