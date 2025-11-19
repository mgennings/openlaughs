// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface StateOption {
  value: string;
  label: string;
}

export type UserRole = 'comedian' | 'fan' | 'promoter' | 'admin';

export interface RoleOption {
  role: UserRole;
  icon: string;
  title: string;
  description: string;
  emoji: string;
}

// ============================================================================
// USER & AUTHENTICATION
// ============================================================================

export const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'comedian',
    icon: 'microphone-2',
    title: 'Comedian',
    description:
      'You perform comedy! Create your profile, manage bookings, track shows, and connect with venues.',
    emoji: '🎤',
  },
  {
    role: 'fan',
    icon: 'heart',
    title: 'Fan',
    description:
      'You love comedy! Discover shows, save favorites, follow comedians, and never miss a laugh.',
    emoji: '❤️',
  },
  {
    role: 'promoter',
    icon: 'chart-line-up',
    title: 'Promoter',
    description:
      'You book shows! Manage events, connect with comedians, track performances, and grow your venue.',
    emoji: '📈',
  },
  {
    role: 'admin',
    icon: 'setting-2',
    title: 'Admin',
    description:
      'System administrator. Full access to manage users, venues, shows, and platform settings.',
    emoji: '⚙️',
  },
];

// ============================================================================
// LOCATION
// ============================================================================

export const US_STATES: StateOption[] = [
  { value: '', label: 'Select a state' },
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
];

// ============================================================================
// COMEDIAN CONSTANTS
// ============================================================================

export const COMEDY_STYLES = [
  'Observational',
  'Dark Comedy',
  'Physical Comedy',
  'Storytelling',
  'Character Comedy',
  'Political',
  'Self-Deprecating',
  'Absurdist',
  'Musical Comedy',
  'Clean',
  'Roast',
  'Impressions',
  'Crowd Work',
  'Wordplay',
  'Deadpan',
  'Satire',
  'Improv',
];

export const PERFORMANCE_TYPES = [
  'Stand-up',
  'Improv',
  'Sketch',
  'Character Work',
  'Musical Comedy',
  'Hosting',
  'Acting',
  'Roasting',
  'Podcasting',
];

export const CONTENT_RATINGS = ['Clean', 'PG-13', 'Adult', 'NSFW', 'Mixed'];

export const COMEDIAN_AVAILABILITY_OPTIONS = [
  'Available for Bookings',
  'Limited Availability',
  'On Tour',
  'Not Currently Booking',
  'By Request Only',
];

// ============================================================================
// SHOW CONSTANTS
// ============================================================================

export const AGE_RESTRICTIONS = ['All Ages', '18+', '21+', 'Other'];

// ============================================================================
// VENUE CONSTANTS
// ============================================================================

// Add venue-specific constants here as needed
// export const VENUE_TYPES = ['Comedy Club', 'Bar', 'Theater', 'Other'];
