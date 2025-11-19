/**
 * Validation Utilities
 * Handles validation and formatting for phone numbers, emails, and other common inputs
 */

/**
 * Phone Number Utilities
 */

/**
 * Formats phone number to (XXX) XXX-XXXX format
 */
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');

  // Format based on length
  if (digits.length === 0) return '';
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

/**
 * Cleans phone number to digits only (removes +1 prefix if present)
 */
export const cleanPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');

  // If starts with 1 and has 11 digits, remove the leading 1 (US country code)
  if (digits.length === 11 && digits.startsWith('1')) {
    return digits.substring(1);
  }

  return digits;
};

/**
 * Validates US phone number (10 digits)
 */
export const validatePhoneNumber = (
  value: string,
): { valid: boolean; error?: string } => {
  if (!value || value.trim() === '') {
    return { valid: true }; // Empty is valid (optional field)
  }

  const digits = cleanPhoneNumber(value);

  if (digits.length === 0) {
    return { valid: true }; // Empty after cleaning is valid
  }

  if (digits.length !== 10) {
    return {
      valid: false,
      error: 'Phone number must be 10 digits (US format)',
    };
  }

  // Check if starts with valid area code (not 0 or 1)
  if (digits[0] === '0' || digits[0] === '1') {
    return {
      valid: false,
      error: 'Area code cannot start with 0 or 1',
    };
  }

  return { valid: true };
};

/**
 * Formats phone number for display in inputs (while typing)
 */
export const formatPhoneInput = (value: string): string => {
  const digits = cleanPhoneNumber(value);
  return formatPhoneNumber(digits);
};

/**
 * Formats phone number for storage (clean digits with optional +1 prefix)
 */
export const formatPhoneForStorage = (value: string): string => {
  const digits = cleanPhoneNumber(value);
  return digits.length === 10 ? `+1${digits}` : digits;
};

/**
 * Formats phone number for display (readable format)
 * Handles numbers stored with or without +1 prefix
 */
export const formatPhoneForDisplay = (value: string): string => {
  if (!value) return '';

  // Clean the number (handles +1 prefix and any formatting)
  const cleaned = cleanPhoneNumber(value);
  return formatPhoneNumber(cleaned);
};

/**
 * Email Utilities
 */

/**
 * Email validation regex (RFC 5322 simplified)
 */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Validates email address
 */
export const validateEmail = (
  value: string,
): { valid: boolean; error?: string } => {
  if (!value || value.trim() === '') {
    return { valid: true }; // Empty is valid (optional field)
  }

  const trimmed = value.trim().toLowerCase();

  // Check length
  if (trimmed.length > 254) {
    return {
      valid: false,
      error: 'Email address is too long (max 254 characters)',
    };
  }

  // Check format
  if (!EMAIL_REGEX.test(trimmed)) {
    return {
      valid: false,
      error: 'Please enter a valid email address',
    };
  }

  // Check for common typos
  const commonTypos = [
    'gmial.com',
    'gmai.com',
    'yahooo.com',
    'yaho.com',
    'outlok.com',
  ];

  const domain = trimmed.split('@')[1];
  if (commonTypos.includes(domain)) {
    const suggestions: Record<string, string> = {
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'yahooo.com': 'yahoo.com',
      'yaho.com': 'yahoo.com',
      'outlok.com': 'outlook.com',
    };
    return {
      valid: false,
      error: `Did you mean ${suggestions[domain]}?`,
    };
  }

  return { valid: true };
};

/**
 * Cleans email (trims and lowercases)
 */
export const cleanEmail = (value: string): string => {
  return value.trim().toLowerCase();
};

/**
 * URL Utilities
 */

/**
 * Validates URL format
 */
export const validateUrl = (
  value: string,
): { valid: boolean; error?: string } => {
  if (!value || value.trim() === '') {
    return { valid: true }; // Empty is valid (optional field)
  }

  try {
    const url = new URL(value);
    // Only allow http and https
    if (!['http:', 'https:'].includes(url.protocol)) {
      return {
        valid: false,
        error: 'URL must start with http:// or https://',
      };
    }
    return { valid: true };
  } catch {
    return {
      valid: false,
      error: 'Please enter a valid URL (e.g., https://example.com)',
    };
  }
};

/**
 * Adds https:// to URL if missing protocol
 */
export const normalizeUrl = (value: string): string => {
  if (!value || value.trim() === '') return '';

  const trimmed = value.trim();

  // Already has protocol
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Add https://
  return `https://${trimmed}`;
};

/**
 * General Validation Utilities
 */

/**
 * Validates required field
 */
export const validateRequired = (
  value: string | number | null | undefined,
  fieldName: string,
): { valid: boolean; error?: string } => {
  if (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    return {
      valid: false,
      error: `${fieldName} is required`,
    };
  }
  return { valid: true };
};

/**
 * Validates min length
 */
export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string,
): { valid: boolean; error?: string } => {
  if (!value || value.trim() === '') {
    return { valid: true }; // Empty is valid (use validateRequired for required fields)
  }

  if (value.trim().length < minLength) {
    return {
      valid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }

  return { valid: true };
};

/**
 * Validates max length
 */
export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string,
): { valid: boolean; error?: string } => {
  if (!value || value.trim() === '') {
    return { valid: true };
  }

  if (value.trim().length > maxLength) {
    return {
      valid: false,
      error: `${fieldName} must be no more than ${maxLength} characters`,
    };
  }

  return { valid: true };
};

/**
 * Validates year (1900 to current year)
 */
export const validateYear = (
  value: number | string,
): { valid: boolean; error?: string } => {
  if (!value) {
    return { valid: true }; // Empty is valid
  }

  const year = typeof value === 'string' ? parseInt(value) : value;
  const currentYear = new Date().getFullYear();

  if (isNaN(year)) {
    return {
      valid: false,
      error: 'Please enter a valid year',
    };
  }

  if (year < 1900 || year > currentYear) {
    return {
      valid: false,
      error: `Year must be between 1900 and ${currentYear}`,
    };
  }

  return { valid: true };
};

/**
 * Combined validation helper
 */
export const runValidations = (
  validators: Array<{ valid: boolean; error?: string }>,
): { valid: boolean; error?: string } => {
  for (const validation of validators) {
    if (!validation.valid) {
      return validation;
    }
  }
  return { valid: true };
};
