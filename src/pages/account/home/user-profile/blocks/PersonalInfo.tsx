import { KeenIcon } from '@/components';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useGraphQL } from '@/lib/useGraphQL';
import { listUserProfiles } from '@/graphql/queries';
import { createUserProfile, updateUserProfile } from '@/graphql/mutations';
import type { UserProfile } from '@/API';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { getPublicUrl, uploadPublicImage } from '@/lib/storage';
import { US_STATES } from '@/config/constants';

const PersonalInfo = () => {
  const { execute } = useGraphQL();
  const [profile, setProfile] = useState<UserProfile | undefined>();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    birthdate: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const init = async () => {
      const user = await getCurrentUser();
      const attrs = await fetchUserAttributes();
      const email = attrs.email || '';
      const sub = user.userId;

      // Find by email; create if missing
      const data = await execute<{
        listUserProfiles: { items: (UserProfile | null)[] };
      }>(listUserProfiles, {
        variables: { filter: { email: { eq: email } }, limit: 1 },
      });
      let found = data.listUserProfiles.items.filter(Boolean)[0] as
        | UserProfile
        | undefined;
      if (!found) {
        const created = await execute<{ createUserProfile: UserProfile }>(
          createUserProfile,
          {
            variables: {
              input: {
                id: sub,
                email,
                role: 'fan',
              },
            },
          },
        );
        found = created.createUserProfile;
      }
      setProfile(found);
      setForm({
        firstName: found?.firstName || '',
        lastName: found?.lastName || '',
        gender: found?.gender || '',
        birthdate: found?.birthdate || '',
        addressLine1: found?.addressLine1 || '',
        addressLine2: found?.addressLine2 || '',
        city: found?.city || '',
        state: found?.state || '',
        postalCode: found?.postalCode || '',
        country: found?.country || '',
      });

      if (found?.profileImageKey) {
        const url = await getPublicUrl(found.profileImageKey);
        setAvatarUrl(url.toString());
      }
    };
    void init();
  }, []);

  const updateField = async (patch: Partial<UserProfile>) => {
    if (!profile || saving) return;
    setSaving(true);
    try {
      const input: any = { id: profile.id, ...patch };
      const res = await execute<{ updateUserProfile: UserProfile }>(
        updateUserProfile,
        { variables: { input } },
      );
      setProfile(res.updateUserProfile);
      setForm(prev => ({
        ...prev,
        firstName: res.updateUserProfile.firstName || prev.firstName,
        lastName: res.updateUserProfile.lastName || prev.lastName,
        gender: res.updateUserProfile.gender || prev.gender,
        birthdate: res.updateUserProfile.birthdate || prev.birthdate,
        addressLine1: res.updateUserProfile.addressLine1 || prev.addressLine1,
        addressLine2: res.updateUserProfile.addressLine2 || prev.addressLine2,
        city: res.updateUserProfile.city || prev.city,
        state: res.updateUserProfile.state || prev.state,
        postalCode: res.updateUserProfile.postalCode || prev.postalCode,
        country: res.updateUserProfile.country || prev.country,
      }));
    } finally {
      setSaving(false);
    }
  };

  const beginEdit = () => {
    if (!profile) return;
    setForm({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      gender: profile.gender || '',
      birthdate: profile.birthdate || '',
      addressLine1: profile.addressLine1 || '',
      addressLine2: profile.addressLine2 || '',
      city: profile.city || '',
      state: profile.state || '',
      postalCode: profile.postalCode || '',
      country: profile.country || '',
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    if (profile) {
      setForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        gender: profile.gender || '',
        birthdate: profile.birthdate || '',
        addressLine1: profile.addressLine1 || '',
        addressLine2: profile.addressLine2 || '',
        city: profile.city || '',
        state: profile.state || '',
        postalCode: profile.postalCode || '',
        country: profile.country || '',
      });
    }
    setIsEditing(false);
  };

  const submitEdit = async () => {
    if (!profile) return;
    await updateField({
      firstName: form.firstName || null,
      lastName: form.lastName || null,
      gender: form.gender || null,
      birthdate: form.birthdate || null,
      addressLine1: form.addressLine1 || null,
      addressLine2: form.addressLine2 || null,
      city: form.city || null,
      state: form.state || null,
      postalCode: form.postalCode || null,
      country: form.country || null,
    } as Partial<UserProfile>);
    setIsEditing(false);
  };

  const display = useMemo(
    () => ({
      firstName: profile?.firstName || '—',
      lastName: profile?.lastName || '—',
      gender: profile?.gender || '—',
      birthdate: profile?.birthdate || '—',
      addressLine1: profile?.addressLine1 || '—',
      addressLine2: profile?.addressLine2 || '—',
      city: profile?.city || '—',
      state: profile?.state || '—',
      postalCode: profile?.postalCode || '—',
      country: profile?.country || '—',
    }),
    [profile],
  );

  const onAvatarSelected = async (file: File) => {
    if (!profile) return;
    const ext = file.name.split('.').pop() || 'jpg';
    const key = `profile-avatars/${profile.id}-avatar-${Date.now()}.${ext}`;
    await uploadPublicImage(key, file, file.type);
    await execute<{ updateUserProfile: UserProfile }>(updateUserProfile, {
      variables: { input: { id: profile.id, profileImageKey: key } },
    });
    const url = await getPublicUrl(key);
    setAvatarUrl(url.toString());
    setProfile({ ...profile, profileImageKey: key });
  };

  return (
    <div className="card min-w-full" id="personal-info-card">
      <div className="card-header">
        <h3 className="card-title">Personal Info</h3>
        <div className="flex items-center gap-2 ml-auto">
          {!isEditing ? (
            <button
              className="btn btn-sm btn-icon btn-clear btn-primary"
              onClick={beginEdit}
              title="Edit"
            >
              <KeenIcon icon="notepad-edit" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                className="btn btn-sm btn-icon btn-clear btn-danger"
                onClick={cancelEdit}
                title="Cancel"
              >
                <KeenIcon icon="cross" />
              </button>
              <button
                className="btn btn-sm btn-icon btn-clear btn-success"
                onClick={submitEdit}
                disabled={saving}
                title="Save"
              >
                <KeenIcon icon="check" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="card-table scrollable-x-auto pb-3">
        <table className="table align-middle text-sm text-gray-500">
          <tbody>
            <tr>
              <td className="py-2 min-w-28 text-gray-600 font-normal">Photo</td>
              <td className="py-2 text-gray700 font-normal min-w-32 text-2sm">
                {isEditing ? (
                  <div>
                    {/* <label
                      htmlFor="profile_photo_input"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Photo
                    </label> */}
                    <div className="mt-2 flex items-center gap-x-3">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="avatar"
                          className="size-12 rounded-full object-cover"
                        />
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          data-slot="icon"
                          aria-hidden="true"
                          className="size-12 text-gray-300"
                        >
                          <path
                            d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                            clipRule="evenodd"
                            fillRule="evenodd"
                          />
                        </svg>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        id="profile_photo_input"
                        className="hidden"
                        onChange={e => {
                          const f = e.target.files?.[0];
                          if (f) void onAvatarSelected(f);
                        }}
                      />
                      <label
                        htmlFor="profile_photo_input"
                        className="button rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
                      >
                        Change
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-x-3">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="avatar"
                        className="size-12 rounded-full object-cover"
                      />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        data-slot="icon"
                        aria-hidden="true"
                        className="size-12 text-gray-300"
                      >
                        <path
                          d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                          clipRule="evenodd"
                          fillRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                )}
              </td>
              <td className="py-2 text-center"></td>
            </tr>
            <tr>
              <td className="py-2 text-gray-600 font-normal">First name</td>
              <td className="py-2 text-gray-800 font-normaltext-sm">
                {isEditing ? (
                  <input
                    className="input"
                    type="text"
                    value={form.firstName}
                    onChange={e =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                  />
                ) : (
                  display.firstName
                )}
              </td>
              <td className="py-2 text-center"></td>
            </tr>
            <tr>
              <td className="py-2 text-gray-600 font-normal">Last name</td>
              <td className="py-2 text-gray-800 font-normaltext-sm">
                {isEditing ? (
                  <input
                    className="input"
                    type="text"
                    value={form.lastName}
                    onChange={e =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                  />
                ) : (
                  display.lastName
                )}
              </td>
              <td className="py-2 text-center"></td>
            </tr>
            <tr>
              <td className="py-3 text-gray-600 font-normal">Status</td>
              <td className="py-3 text-gray-800 font-normal">
                <span className="badge badge-sm badge-outline badge-success">
                  Online
                </span>
              </td>
              <td className="py-3 text-center"></td>
            </tr>
            <tr>
              <td className="py-3 text-gray-600 font-normal">Birthday</td>
              <td className="py-3 text-gray-700 text-sm font-normal">
                {isEditing ? (
                  <input
                    className="input"
                    type="date"
                    value={form.birthdate}
                    onChange={e =>
                      setForm({ ...form, birthdate: e.target.value })
                    }
                  />
                ) : display.birthdate && display.birthdate !== '—' ? (
                  new Date(display.birthdate + 'T12:00:00Z').toLocaleDateString(
                    'en-US',
                  )
                ) : (
                  ''
                )}
              </td>
              <td className="py-3 text-center"></td>
            </tr>
            <tr>
              <td className="py-3 text-gray-600 font-normal">Gender</td>
              <td className="py-3 text-gray-700 text-sm font-normal">
                {isEditing ? (
                  <input
                    className="input"
                    type="text"
                    value={form.gender}
                    onChange={e => setForm({ ...form, gender: e.target.value })}
                  />
                ) : (
                  display.gender
                )}
              </td>
              <td className="py-3 text-center"></td>
            </tr>
            <tr>
              <td className="py-3 text-gray-600 font-normal">Address line 1</td>
              <td className="py-3 text-gray-700 text-2sm font-normal">
                {isEditing ? (
                  <input
                    className="input"
                    type="text"
                    value={form.addressLine1}
                    onChange={e =>
                      setForm({ ...form, addressLine1: e.target.value })
                    }
                  />
                ) : (
                  display.addressLine1
                )}
              </td>
              <td className="py-3 text-center"></td>
            </tr>
            <tr>
              <td className="py-3 text-gray-600 font-normal">Address line 2</td>
              <td className="py-3 text-gray-700 text-2sm font-normal full-width">
                {isEditing ? (
                  <input
                    className="input"
                    type="text"
                    value={form.addressLine2}
                    onChange={e =>
                      setForm({ ...form, addressLine2: e.target.value })
                    }
                  />
                ) : (
                  display.addressLine2
                )}
              </td>
              <td className="py-3 text-center"></td>
            </tr>
            <tr>
              <td className="py-3 text-gray-600 font-normal">City</td>
              <td className="py-3 text-gray-700 text-2sm font-normal">
                {isEditing ? (
                  <input
                    className="input"
                    type="text"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                  />
                ) : (
                  display.city
                )}
              </td>
              <td className="py-3 text-center"></td>
            </tr>
            <tr>
              <td className="py-3 text-gray-600 font-normal">State</td>
              <td className="py-3 text-gray-700 text-2sm font-normal">
                {isEditing ? (
                  <select
                    className="input"
                    value={form.state}
                    onChange={e => setForm({ ...form, state: e.target.value })}
                  >
                    {US_STATES.map(stateOption => (
                      <option key={stateOption.value} value={stateOption.value}>
                        {stateOption.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  display.state
                )}
              </td>
              <td className="py-3 text-center"></td>
            </tr>
            <tr>
              <td className="py-3 text-gray-600 font-normal">Postal code</td>
              <td className="py-3 text-gray-700 text-2sm font-normal">
                {isEditing ? (
                  <input
                    className="input"
                    type="text"
                    value={form.postalCode}
                    onChange={e =>
                      setForm({ ...form, postalCode: e.target.value })
                    }
                  />
                ) : (
                  display.postalCode
                )}
              </td>
              <td className="py-3 text-center"></td>
            </tr>
            <tr>
              <td className="py-3 text-gray-600 font-normal">Country</td>
              <td className="py-3 text-gray-700 text-2sm font-normal">
                {isEditing ? (
                  <input
                    className="input"
                    type="text"
                    value={form.country}
                    onChange={e =>
                      setForm({ ...form, country: e.target.value })
                    }
                  />
                ) : (
                  display.country
                )}
              </td>
              <td className="py-3 text-center"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { PersonalInfo };
