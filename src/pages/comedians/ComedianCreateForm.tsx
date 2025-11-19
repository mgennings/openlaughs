import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createComedian } from '@/graphql/mutations';
import type { CreateComedianInput } from '@/API';
import { KeenIcon, Alert } from '@/components';
import { ImageInput, type TImageInputFiles } from '@/components/image-input';
import { uploadPublicImage } from '@/lib/storage';
import {
  validateSocialMediaUsername,
  cleanSocialMediaInput,
} from '@/utils/socialMedia';
import {
  validatePhoneNumber,
  validateEmail,
  formatPhoneInput,
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

interface ComedianCreateFormProps {
  createdBy: string;
  onCreated?: () => void;
  onCancelClick?: () => void;
  onError?: (message: string) => void;
}

const ComedianCreateForm = ({
  createdBy,
  onCreated,
  onError,
  onCancelClick,
}: ComedianCreateFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<TImageInputFiles>([]);
  const [socialErrors, setSocialErrors] = useState<Record<string, string>>({});
  const [contactErrors, setContactErrors] = useState<Record<string, string>>(
    {},
  );

  const [formData, setFormData] = useState<Partial<CreateComedianInput>>({
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

    setLoading(true);
    setError(null);

    try {
      // Upload profile image if provided
      let profileImageKey: string | undefined;
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

      const input: CreateComedianInput = {
        stageName: formData.stageName,
        bio: formData.bio || undefined,
        profileImageKey: profileImageKey,
        basedIn: formData.basedIn || undefined,
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
        performingSince: formData.performingSince || undefined,
        headline: formData.headline || undefined,
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
        createdBy: createdBy || undefined,
      };

      const result = await client.graphql({
        query: (createComedian as string).replace(/__typename/g, ''),
        variables: { input },
      });

      if ('errors' in result && result.errors) {
        throw new Error(result.errors[0].message);
      }

      // Reset form on success
      setFormData({
        stageName: '',
        bio: '',
        basedIn: '',
        isActive: true,
      });
      setProfileImage([]);
      setError(null);
      onCreated?.();
    } catch (err: any) {
      console.error('Error creating comedian:', err);
      const errorMessage = err.message || 'Failed to create comedian';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    setFormData({
      stageName: '',
      bio: '',
      basedIn: '',
      isActive: true,
      isVerified: false,
      isFeatured: false,
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
    });
    setProfileImage([]);
    setError(null);
    onCancelClick?.();
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

    // Validate on blur/change
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
            value={formData.stageName}
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
          <ImageInput
            value={profileImage}
            onChange={setProfileImage}
            multiple={false}
            acceptType={['image/jpeg', 'image/png', 'image/webp']}
          >
            {({
              fileList,
              onImageUpload,
              onImageRemove,
              isDragging,
              dragProps,
            }) =>
              fileList.length > 0 ? (
                <div className="relative group">
                  <img
                    src={fileList[0].dataURL}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => onImageRemove(0)}
                    className="absolute top-2 right-2 bg-danger text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <KeenIcon icon="trash" className="text-sm" />
                  </button>
                </div>
              ) : (
                <div
                  {...dragProps}
                  onClick={onImageUpload}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  <KeenIcon
                    icon="picture"
                    className="text-4xl text-gray-400 mb-2"
                  />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload profile image
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
              placeholder="e.g., Austin, TX"
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
                  performingSince: parseInt(e.target.value) || undefined,
                })
              }
              placeholder="e.g., 2015"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
        </div>
      </div>

      {/* Comedy Profile */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-base font-semibold text-gray-900">
          Comedy Profile
        </h4>

        <div>
          <label className="form-label">Comedy Styles</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {COMEDY_STYLES.map(style => (
              <button
                key={style}
                type="button"
                onClick={() => handleStyleToggle(style)}
                className={`badge badge-lg ${
                  formData.comedyStyles?.includes(style)
                    ? 'badge-primary'
                    : 'badge-light'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="form-label">Performance Types</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {PERFORMANCE_TYPES.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeToggle(type)}
                className={`badge badge-lg ${
                  formData.performanceTypes?.includes(type)
                    ? 'badge-primary'
                    : 'badge-light'
                }`}
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
              <option value="">Select rating...</option>
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

      {/* Social Media */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-base font-semibold text-gray-900">Social Media</h4>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="form-label flex items-center gap-2">
              <KeenIcon icon="dribbble" /> Website
            </label>
            <input
              type="url"
              className="input"
              value={formData.website || ''}
              onChange={e =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="form-label flex items-center gap-2">
              Instagram
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
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
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
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

          <div>
            <label className="form-label">TikTok</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
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
      </div>

      {/* Contact Information */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-base font-semibold text-gray-900">
          Contact Information
        </h4>

        <div className="grid md:grid-cols-2 gap-4">
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
      </div>

      {/* Admin Settings */}
      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-base font-semibold text-gray-900">
          Admin Settings
        </h4>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox"
              checked={formData.isActive || false}
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
              checked={formData.isVerified || false}
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
              checked={formData.isFeatured || false}
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
          type="button"
          className="btn btn-light"
          onClick={handleCancelClick}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={
            loading ||
            !formData.stageName ||
            Object.keys(socialErrors).length > 0 ||
            Object.keys(contactErrors).length > 0
          }
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Creating...
            </>
          ) : (
            <>
              <KeenIcon icon="plus" className="me-2" />
              Create Comedian
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export { ComedianCreateForm };
