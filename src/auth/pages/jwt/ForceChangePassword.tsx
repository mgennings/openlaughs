import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert, KeenIcon } from '@/components';
import { useAuthContext } from '@/auth';
import { useState } from 'react';
import clsx from 'clsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLayout } from '@/providers';
import { AxiosError } from 'axios';

const passwordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .min(3, 'Password must be at least 3 characters')
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});

const ForceChangePassword = () => {
  const { currentLayout } = useLayout();
  const { confirmSignInWithNewPassword } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirmation, setShowNewPasswordConfirmation] =
    useState(false);

  // Get session from location state (passed from login)
  const session = location.state?.session;
  const email = location.state?.email;

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: passwordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(undefined);

      try {
        if (!confirmSignInWithNewPassword) {
          throw new Error('confirmSignInWithNewPassword is not available');
        }

        // Note: In AWS Amplify v6, the session is managed internally
        // If a session is provided (from custom error handler), we pass it
        // Otherwise, Amplify will use the internally managed session
        await confirmSignInWithNewPassword(
          session,
          values.oldPassword,
          values.newPassword,
        );
        setHasErrors(false);

        // Redirect to dashboard after successful password change
        navigate('/dashboard', { replace: true });
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          setStatus(error.response.data.message);
        } else if (error instanceof Error) {
          setStatus(error.message);
        } else {
          setStatus('Password change failed. Please try again.');
        }
        setHasErrors(true);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="card max-w-[420px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-5 md:p-10"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Change Password
          </h3>
          <span className="text-2sm text-gray-600 font-medium">
            You must change your password to continue
          </span>
        </div>

        {hasErrors && <Alert variant="danger">{formik.status}</Alert>}

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Current Password</label>
          <label className="input">
            <input
              type={showOldPassword ? 'text' : 'password'}
              placeholder="Enter your current password"
              autoComplete="current-password"
              {...formik.getFieldProps('oldPassword')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid':
                    formik.touched.oldPassword && formik.errors.oldPassword,
                },
                {
                  'is-valid':
                    formik.touched.oldPassword && !formik.errors.oldPassword,
                },
              )}
            />
            <button
              className="btn btn-icon"
              onClick={e => {
                e.preventDefault();
                setShowOldPassword(!showOldPassword);
              }}
            >
              <KeenIcon
                icon="eye"
                className={clsx('text-gray-500', { hidden: showOldPassword })}
              />
              <KeenIcon
                icon="eye-slash"
                className={clsx('text-gray-500', { hidden: !showOldPassword })}
              />
            </button>
          </label>
          {formik.touched.oldPassword && formik.errors.oldPassword && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.oldPassword}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">New Password</label>
          <label className="input">
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Enter a new password"
              autoComplete="new-password"
              {...formik.getFieldProps('newPassword')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid':
                    formik.touched.newPassword && formik.errors.newPassword,
                },
                {
                  'is-valid':
                    formik.touched.newPassword && !formik.errors.newPassword,
                },
              )}
            />
            <button
              className="btn btn-icon"
              onClick={e => {
                e.preventDefault();
                setShowNewPassword(!showNewPassword);
              }}
            >
              <KeenIcon
                icon="eye"
                className={clsx('text-gray-500', { hidden: showNewPassword })}
              />
              <KeenIcon
                icon="eye-slash"
                className={clsx('text-gray-500', { hidden: !showNewPassword })}
              />
            </button>
          </label>
          {formik.touched.newPassword && formik.errors.newPassword && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.newPassword}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label font-normal text-gray-900">
            Confirm New Password
          </label>
          <label className="input">
            <input
              type={showNewPasswordConfirmation ? 'text' : 'password'}
              placeholder="Re-enter your new password"
              autoComplete="new-password"
              {...formik.getFieldProps('confirmPassword')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid':
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword,
                },
                {
                  'is-valid':
                    formik.touched.confirmPassword &&
                    !formik.errors.confirmPassword,
                },
              )}
            />
            <button
              className="btn btn-icon"
              onClick={e => {
                e.preventDefault();
                setShowNewPasswordConfirmation(!showNewPasswordConfirmation);
              }}
            >
              <KeenIcon
                icon="eye"
                className={clsx('text-gray-500', {
                  hidden: showNewPasswordConfirmation,
                })}
              />
              <KeenIcon
                icon="eye-slash"
                className={clsx('text-gray-500', {
                  hidden: !showNewPasswordConfirmation,
                })}
              />
            </button>
          </label>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.confirmPassword}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary flex justify-center grow"
          disabled={loading}
        >
          {loading ? 'Please wait...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export { ForceChangePassword };
