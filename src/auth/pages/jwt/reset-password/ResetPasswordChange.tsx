import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert, KeenIcon } from '@/components';
import { useAuthContext } from '@/auth';
import { useState } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/providers';
import { AxiosError } from 'axios';

const passwordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});

const ResetPasswordChange = () => {
  const { currentLayout } = useLayout();
  const { resetPassword } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirmation, setShowNewPasswordConfirmation] =
    useState(false);

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: passwordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(undefined);

      const code = new URLSearchParams(window.location.search).get('code');
      const email = new URLSearchParams(window.location.search).get('email');

      if (!code || !email) {
        setHasErrors(true);
        setStatus('Verification code and email are required');
        setLoading(false);
        setSubmitting(false);
        return;
      }

      try {
        if (!resetPassword) {
          throw new Error('Password reset service is not available');
        }
        await resetPassword(email, code, values.newPassword);
        setHasErrors(false);
        navigate(
          currentLayout?.name === 'auth-branded'
            ? '/auth/reset-password/changed'
            : '/auth/classic/reset-password/changed',
        );
      } catch (error: any) {
        let errorMessage = 'Password reset failed. Please try again.';
        if (error instanceof AxiosError && error.response) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          if (error.message.includes('CodeMismatchException')) {
            errorMessage =
              'Invalid verification code. Please check and try again.';
          } else if (error.message.includes('ExpiredCodeException')) {
            errorMessage =
              'This verification code has expired. Please request a new one.';
          } else {
            errorMessage = error.message;
          }
        }
        setStatus(errorMessage);
        setHasErrors(true);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="card max-w-[370px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-10"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Reset Password</h3>
          <span className="text-2sm text-gray-700">
            Enter your new password
          </span>
        </div>

        {hasErrors && <Alert variant="danger">{formik.status}</Alert>}

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">New Password</label>
          <label className="input">
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Enter a new password"
              autoComplete="off"
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
              placeholder="Re-enter a new Password"
              autoComplete="off"
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
          {loading ? 'Please wait...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export { ResetPasswordChange };
