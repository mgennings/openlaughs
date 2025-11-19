import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { updateComedian } from '@/graphql/mutations';
import { getComedian } from '@/graphql/queries';
import type { Comedian, UpdateComedianInput } from '@/API';
import { KeenIcon, Alert } from '@/components';
import { ImageInput, type TImageInputFiles } from '@/components/image-input';
import { uploadPublicImage, getPublicUrl } from '@/lib/storage';
import {
  validateSocialMediaUsername,
  cleanSocialMediaInput,
} from '@/utils/socialMedia';
import {
  validatePhoneNumber,
  validateEmail,
  formatPhoneInput,
  formatPhoneForDisplay,
  cleanPhoneNumber,
  cleanEmail,
} from '@/utils/validation';
import {
  COMEDY_STYLES,
  PERFORMANCE_TYPES,
  CONTENT_RATINGS,
  COMEDIAN_AVAILABILITY_OPTIONS,
} from '@/config/constants';

const client = generateClient({ authMode: 'userPool' });

interface ComedianUpdateFormProps {
  comedianId: string;
  onUpdated?: () => void;
  onError?: (message: string) => void;
}

const ComedianUpdateForm = ({
  comedianId,
  onUpdated,
  onError,
}: ComedianUpdateFormProps) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<TImageInputFiles>([]);
  const [existingImageKey, setExistingImageKey] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [socialErrors, setSocialErrors] = useState<Record<string, string>>({});
  const [contactErrors, setContactErrors] = useState<Record<string, string>>(
    {},
  );

  const [formData, setFormData] = useState<Partial<UpdateComedianInput>>({
    stageName: '',
    bio: '',
    basedIn: '',
    isActive: true,
    availability: 'Available for Bookings',
    comedyStyles: [],
    performanceTypes: [],
    contentRating: '',
    performingSince: undefined,
    headline: '',
    website: '',
    instagram: '',
    twitter: '',
    tiktok: '',
    youtube: '',
    facebook: '',
    businessEmail: '',
    businessPhone: '',
    isVerified: false,
    isFeatured: false,
    status: 'active',
  });

  useEffect(() => {
    const loadComedian = async () => {
      try {
        setLoading(true);
        const result = await client.graphql({
          query: (getComedian as string).replace(/__typename/g, ''),
          variables: { id: comedianId },
        });

        if ('data' in result && result.data?.getComedian) {
          const comedian = result.data.getComedian as Comedian;
          setFormData({
            stageName: comedian.stageName || '',
            bio: comedian.bio || '',
            headline: comedian.headline || '',
            basedIn: comedian.basedIn || '',
            firstName: comedian.firstName || '',
            lastName: comedian.lastName || '',
            pronouns: comedian.pronouns || '',
            performingSince: comedian.performingSince || undefined,
            isActive: comedian.isActive ?? true,
            availability: comedian.availability || 'Available for Bookings',
            comedyStyles: comedian.comedyStyles || [],
            performanceTypes: comedian.performanceTypes || [],
            contentRating: comedian.contentRating || '',
            website: comedian.website || '',
            instagram: comedian.instagram || '',
            twitter: comedian.twitter || '',
            tiktok: comedian.tiktok || '',
            youtube: comedian.youtube || '',
            facebook: comedian.facebook || '',
            businessEmail: comedian.businessEmail || '',
            businessPhone: formatPhoneForDisplay(comedian.businessPhone || ''),
            isVerified: comedian.isVerified ?? false,
            isFeatured: comedian.isFeatured ?? false,
            status: comedian.status || 'active',
          });

          // Load existing profile image
          if (comedian.profileImageKey) {
            setExistingImageKey(comedian.profileImageKey);
            try {
              const url = await getPublicUrl(comedian.profileImageKey);
              setExistingImageUrl(url.toString());
            } catch (err) {
              console.error('Failed to load profile image:', err);
            }
          }
        }
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to load comedian';
        setError(errorMessage);
        onError?.(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    void loadComedian();
  }, [comedianId, onError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.stageName) {
      setError('Stage name is required');
      return;
    }

    // Check for validation errors
    if (
      Object.keys(socialErrors).length > 0 ||
      Object.keys(contactErrors).length > 0
    ) {
      setError('Please fix validation errors before submitting');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Upload new profile image if provided
      let profileImageKey = existingImageKey;
      if (profileImage.length > 0 && profileImage[0].file) {
        const ext = profileImage[0].file.name.split('.').pop() || 'jpg';
        const key = `comedian-profile-images/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        await uploadPublicImage(
          key,
          profileImage[0].file,
          profileImage[0].file.type,
        );
        profileImageKey = key;
      }

      const input: UpdateComedianInput = {
        id: comedianId,
        stageName: formData.stageName,
        bio: formData.bio || undefined,
        profileImageKey: profileImageKey || undefined,
        headline: formData.headline || undefined,
        basedIn: formData.basedIn || undefined,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        pronouns: formData.pronouns || undefined,
        performingSince: formData.performingSince || undefined,
        isActive: formData.isActive,
        availability: formData.availability || undefined,
        comedyStyles:
          formData.comedyStyles && formData.comedyStyles.length > 0
            ? formData.comedyStyles
            : undefined,
        performanceTypes:
          formData.performanceTypes && formData.performanceTypes.length > 0
            ? formData.performanceTypes
            : undefined,
        contentRating: formData.contentRating || undefined,
        website: formData.website || undefined,
        instagram: formData.instagram || undefined,
        twitter: formData.twitter || undefined,
        tiktok: formData.tiktok || undefined,
        youtube: formData.youtube || undefined,
        facebook: formData.facebook || undefined,
        businessEmail: formData.businessEmail || undefined,
        businessPhone: formData.businessPhone
          ? cleanPhoneNumber(formData.businessPhone)
          : undefined,
        isVerified: formData.isVerified || false,
        isFeatured: formData.isFeatured || false,
        status: formData.status || 'active',
      };

      const result = await client.graphql({
        query: (updateComedian as string).replace(/__typename/g, ''),
        variables: { input },
      });

      if ('errors' in result && result.errors) {
        throw new Error(result.errors[0].message);
      }

      onUpdated?.();
    } catch (err: any) {
      console.error('Error updating comedian:', err);
      const errorMessage = err.message || 'Failed to update comedian';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStyleToggle = (style: string) => {
    const styles = formData.comedyStyles || [];
    if (styles.includes(style)) {
      setFormData({
        ...formData,
        comedyStyles: styles.filter(s => s !== style),
      });
    } else {
      setFormData({
        ...formData,
        comedyStyles: [...styles, style],
      });
    }
  };

  const handleTypeToggle = (type: string) => {
    const types = formData.performanceTypes || [];
    if (types.includes(type)) {
      setFormData({
        ...formData,
        performanceTypes: types.filter(t => t !== type),
      });
    } else {
      setFormData({
        ...formData,
        performanceTypes: [...types, type],
      });
    }
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    const cleanValue = cleanSocialMediaInput(value);
    setFormData({ ...formData, [platform]: cleanValue });

    // Validate on change
    if (cleanValue) {
      const validation = validateSocialMediaUsername(platform, cleanValue);
      if (!validation.valid && validation.error) {
        setSocialErrors({ ...socialErrors, [platform]: validation.error });
      } else {
        const { [platform]: _, ...rest } = socialErrors;
        setSocialErrors(rest);
      }
    } else {
      const { [platform]: _, ...rest } = socialErrors;
      setSocialErrors(rest);
    }
  };

  const handlePhoneChange = (value: string) => {
    // Format for display
    const formatted = formatPhoneInput(value);
    setFormData({ ...formData, businessPhone: formatted });

    // Validate
    const validation = validatePhoneNumber(formatted);
    if (!validation.valid && validation.error) {
      setContactErrors({ ...contactErrors, businessPhone: validation.error });
    } else {
      const { businessPhone: _, ...rest } = contactErrors;
      setContactErrors(rest);
    }
  };

  const handleEmailChange = (value: string) => {
    const cleanValue = cleanEmail(value);
    setFormData({ ...formData, businessEmail: cleanValue });

    // Validate
    if (cleanValue) {
      const validation = validateEmail(cleanValue);
      if (!validation.valid && validation.error) {
        setContactErrors({ ...contactErrors, businessEmail: validation.error });
      } else {
        const { businessEmail: _, ...rest } = contactErrors;
        setContactErrors(rest);
      }
    } else {
      const { businessEmail: _, ...rest } = contactErrors;
      setContactErrors(rest);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="text-gray-600">Loading comedian data...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="text-base font-semibold text-gray-900">
          Basic Information
        </h4>

        <div>
          <label className="form-label required">Stage Name</label>
          <input
            type="text"
            className="input"
            value={formData.stageName || ''}
            onChange={e =>
              setFormData({ ...formData, stageName: e.target.value })
            }
            placeholder="e.g., Tony Hinchcliffe"
            required
          />
        </div>

        <div>
          <label className="form-label">Headline / Tagline</label>
          <input
            type="text"
            className="input"
            value={formData.headline || ''}
            onChange={e =>
              setFormData({ ...formData, headline: e.target.value })
            }
            placeholder="One-liner that captures their comedy"
          />
        </div>

        <div>
          <label className="form-label">Bio</label>
          <textarea
            className="textarea"
            rows={4}
            value={formData.bio || ''}
            onChange={e => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about this comedian..."
          />
        </div>

        {/* Profile Image Upload */}
        <div>
          <label className="form-label">Profile Image</label>
          {existingImageUrl && profileImage.length === 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={existingImageUrl}
                  alt="Current profile"
                  className="size-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Current Image
                  </p>
                  <p className="text-xs text-gray-500">
                    Upload a new image to replace
                  </p>
                </div>
              </div>
            </div>
          )}
          <ImageInput
            value={profileImage}
            onChange={setProfileImage}
            multiple={false}
            acceptType={['image/jpeg', 'image/png', 'image/webp']}
          >
            {() =>
              profileImage.length > 0 ? (
                <div className="relative group">
                  <img
                    src={profileImage[0].preview}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setProfileImage([])}
                    className="absolute top-2 right-2 bg-danger text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <KeenIcon icon="trash" className="text-sm" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <KeenIcon
                    icon="picture"
                    className="text-4xl text-gray-400 mb-2"
                  />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload {existingImageUrl ? 'new' : ''} profile
                    image
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              )
            }
          </ImageInput>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Based In</label>
            <input
              type="text"
              className="input"
              value={formData.basedIn || ''}
              onChange={e =>
                setFormData({ ...formData, basedIn: e.target.value })
              }
              placeholder="City, State"
            />
          </div>
          <div>
            <label className="form-label">Performing Since</label>
            <input
              type="number"
              className="input"
              value={formData.performingSince || ''}
              onChange={e =>
                setFormData({
                  ...formData,
                  performingSince: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              placeholder="Year (e.g., 2015)"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="input"
              value={formData.firstName || ''}
              onChange={e =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="input"
              value={formData.lastName || ''}
              onChange={e =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="form-label">Pronouns</label>
            <input
              type="text"
              className="input"
              value={formData.pronouns || ''}
              onChange={e =>
                setFormData({ ...formData, pronouns: e.target.value })
              }
              placeholder="e.g., he/him"
            />
          </div>
        </div>
      </div>

      {/* Comedy Profile */}
      <div className="space-y-4">
        <h4 className="text-base font-semibold text-gray-900">
          Comedy Profile
        </h4>

        <div>
          <label className="form-label">Comedy Styles</label>
          <div className="flex flex-wrap gap-2">
            {COMEDY_STYLES.map(style => (
              <button
                key={style}
                type="button"
                onClick={() => handleStyleToggle(style)}
                className={`badge badge-lg ${
                  formData.comedyStyles?.includes(style)
                    ? 'badge-primary'
                    : 'badge-light'
                } cursor-pointer hover:opacity-80 transition-opacity`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="form-label">Performance Types</label>
          <div className="flex flex-wrap gap-2">
            {PERFORMANCE_TYPES.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeToggle(type)}
                className={`badge badge-lg ${
                  formData.performanceTypes?.includes(type)
                    ? 'badge-info'
                    : 'badge-light'
                } cursor-pointer hover:opacity-80 transition-opacity`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Content Rating</label>
            <select
              className="input"
              value={formData.contentRating || ''}
              onChange={e =>
                setFormData({ ...formData, contentRating: e.target.value })
              }
            >
              <option value="">Select rating</option>
              {CONTENT_RATINGS.map(rating => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Availability</label>
            <select
              className="input"
              value={formData.availability || ''}
              onChange={e =>
                setFormData({ ...formData, availability: e.target.value })
              }
            >
              {COMEDIAN_AVAILABILITY_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Social Media & Contact */}
      <div className="space-y-4">
        <h4 className="text-base font-semibold text-gray-900">
          Social Media & Contact
        </h4>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Website</label>
            <input
              type="url"
              className="input"
              value={formData.website || ''}
              onChange={e =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="form-label">Business Email</label>
            <input
              type="email"
              className={`input ${contactErrors.businessEmail ? 'border-danger' : ''}`}
              value={formData.businessEmail || ''}
              onChange={e => handleEmailChange(e.target.value)}
              placeholder="bookings@example.com"
            />
            {contactErrors.businessEmail && (
              <p className="text-xs text-danger mt-1">
                {contactErrors.businessEmail}
              </p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Instagram</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
                @
              </span>
              <input
                type="text"
                className={`input pl-8 ${socialErrors.instagram ? 'border-danger' : ''}`}
                value={formData.instagram || ''}
                onChange={e =>
                  handleSocialMediaChange('instagram', e.target.value)
                }
                placeholder="username"
              />
            </div>
            {socialErrors.instagram && (
              <p className="text-xs text-danger mt-1">
                {socialErrors.instagram}
              </p>
            )}
          </div>
          <div>
            <label className="form-label">Twitter</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
                @
              </span>
              <input
                type="text"
                className={`input pl-8 ${socialErrors.twitter ? 'border-danger' : ''}`}
                value={formData.twitter || ''}
                onChange={e =>
                  handleSocialMediaChange('twitter', e.target.value)
                }
                placeholder="username"
              />
            </div>
            {socialErrors.twitter && (
              <p className="text-xs text-danger mt-1">{socialErrors.twitter}</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">TikTok</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
                @
              </span>
              <input
                type="text"
                className={`input pl-8 ${socialErrors.tiktok ? 'border-danger' : ''}`}
                value={formData.tiktok || ''}
                onChange={e =>
                  handleSocialMediaChange('tiktok', e.target.value)
                }
                placeholder="username"
              />
            </div>
            {socialErrors.tiktok && (
              <p className="text-xs text-danger mt-1">{socialErrors.tiktok}</p>
            )}
          </div>
          <div>
            <label className="form-label">YouTube</label>
            <input
              type="text"
              className={`input ${socialErrors.youtube ? 'border-danger' : ''}`}
              value={formData.youtube || ''}
              onChange={e => handleSocialMediaChange('youtube', e.target.value)}
              placeholder="@handle or channel URL"
            />
            {socialErrors.youtube && (
              <p className="text-xs text-danger mt-1">{socialErrors.youtube}</p>
            )}
          </div>
          <div>
            <label className="form-label">Facebook</label>
            <input
              type="text"
              className={`input ${socialErrors.facebook ? 'border-danger' : ''}`}
              value={formData.facebook || ''}
              onChange={e =>
                handleSocialMediaChange('facebook', e.target.value)
              }
              placeholder="username or page URL"
            />
            {socialErrors.facebook && (
              <p className="text-xs text-danger mt-1">
                {socialErrors.facebook}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="form-label">Business Phone</label>
          <input
            type="tel"
            className={`input ${contactErrors.businessPhone ? 'border-danger' : ''}`}
            value={formData.businessPhone || ''}
            onChange={e => handlePhoneChange(e.target.value)}
            placeholder="(555) 555-5555"
            maxLength={14}
          />
          {contactErrors.businessPhone && (
            <p className="text-xs text-danger mt-1">
              {contactErrors.businessPhone}
            </p>
          )}
        </div>
      </div>

      {/* Admin Settings */}
      <div className="space-y-4">
        <h4 className="text-base font-semibold text-gray-900">
          Admin Settings
        </h4>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox"
              checked={formData.isActive ?? true}
              onChange={e =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
            />
            <span>Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox"
              checked={formData.isVerified ?? false}
              onChange={e =>
                setFormData({ ...formData, isVerified: e.target.checked })
              }
            />
            <span>Verified</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox"
              checked={formData.isFeatured ?? false}
              onChange={e =>
                setFormData({ ...formData, isFeatured: e.target.checked })
              }
            />
            <span>Featured</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={
            submitting ||
            !formData.stageName ||
            Object.keys(socialErrors).length > 0 ||
            Object.keys(contactErrors).length > 0
          }
        >
          {submitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Updating...
            </>
          ) : (
            <>
              <KeenIcon icon="check" className="me-2" />
              Update Comedian
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export { ComedianUpdateForm };
