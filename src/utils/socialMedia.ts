/**
 * Social Media Utilities
 * Handles URL construction and validation for social media platforms
 */

/**
 * Constructs full URL from username for various social media platforms
 */
export const getSocialMediaUrl = (
  platform: string,
  username: string,
): string => {
  if (!username) return '';

  // Remove @ if user included it
  const cleanUsername = username.replace(/^@/, '').trim();

  const urls: Record<string, string> = {
    instagram: `https://instagram.com/${cleanUsername}`,
    twitter: `https://twitter.com/${cleanUsername}`,
    tiktok: `https://tiktok.com/@${cleanUsername}`,
    youtube:
      cleanUsername.startsWith('http') || cleanUsername.startsWith('@')
        ? cleanUsername.startsWith('http')
          ? cleanUsername
          : `https://youtube.com/${cleanUsername}`
        : `https://youtube.com/@${cleanUsername}`,
    facebook: cleanUsername.startsWith('http')
      ? cleanUsername
      : `https://facebook.com/${cleanUsername}`,
  };

  return urls[platform] || cleanUsername;
};

/**
 * Validation patterns for social media usernames
 */
const validationPatterns: Record<string, RegExp> = {
  // Instagram: letters, numbers, periods, underscores (3-30 chars)
  instagram: /^[a-zA-Z0-9._]{1,30}$/,
  // Twitter: letters, numbers, underscores (1-15 chars)
  twitter: /^[a-zA-Z0-9_]{1,15}$/,
  // TikTok: letters, numbers, periods, underscores (2-24 chars)
  tiktok: /^[a-zA-Z0-9._]{2,24}$/,
  // YouTube: flexible (handles or URLs)
  youtube: /^(@?[a-zA-Z0-9._-]+|https?:\/\/.+)$/,
  // Facebook: flexible (usernames or URLs)
  facebook: /^([a-zA-Z0-9.]+|https?:\/\/.+)$/,
};

/**
 * Validates a social media username
 */
export const validateSocialMediaUsername = (
  platform: string,
  username: string,
): { valid: boolean; error?: string } => {
  if (!username || username.trim() === '') {
    return { valid: true }; // Empty is valid (optional field)
  }

  // Remove @ if present for validation
  const cleanUsername = username.replace(/^@/, '').trim();

  const pattern = validationPatterns[platform];
  if (!pattern) {
    return { valid: true }; // Unknown platform, allow it
  }

  const valid = pattern.test(cleanUsername);

  if (!valid) {
    const errors: Record<string, string> = {
      instagram:
        'Instagram username can only contain letters, numbers, periods, and underscores (max 30 characters)',
      twitter:
        'Twitter username can only contain letters, numbers, and underscores (max 15 characters)',
      tiktok:
        'TikTok username can only contain letters, numbers, periods, and underscores (2-24 characters)',
      youtube: 'Invalid YouTube handle or URL format',
      facebook: 'Invalid Facebook username or URL format',
    };

    return {
      valid: false,
      error: errors[platform] || 'Invalid username format',
    };
  }

  return { valid: true };
};

/**
 * Formats username for display (adds @ if needed)
 */
export const formatSocialMediaDisplay = (
  platform: string,
  username: string,
): string => {
  if (!username) return '';

  const cleanUsername = username.replace(/^@/, '').trim();

  // Platforms that typically show @ symbol
  const showAt = ['instagram', 'twitter', 'tiktok'];

  if (showAt.includes(platform) && !username.startsWith('http')) {
    return `@${cleanUsername}`;
  }

  return cleanUsername;
};

/**
 * Gets icon name for social media platform
 */
export const getSocialMediaIcon = (platform: string): string => {
  const icons: Record<string, string> = {
    instagram: 'instagram',
    twitter: 'twitter',
    tiktok: 'tiktok',
    youtube: 'youtube',
    facebook: 'facebook',
    website: 'global',
  };

  return icons[platform] || 'link';
};

/**
 * Cleans username input (removes @ and extra spaces)
 */
export const cleanSocialMediaInput = (username: string): string => {
  return username.replace(/^@/, '').trim();
};
