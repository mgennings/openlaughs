import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

import { toAbsoluteUrl } from '@/utils';
import { useLayout } from '@/providers';
import { Alert } from '@/components';
import { useAuthContext } from '@/auth';
import { AxiosError } from 'axios';

const codeSchema = Yup.object().shape({
  confirmationCode: Yup.string()
    .required('Verification code is required')
    .min(6, 'Code must be at least 6 characters'),
});

const ResetPasswordCheckEmail = () => {
  const { currentLayout } = useLayout();
  const { requestPasswordResetLink } = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | undefined>();

  useEffect(() => {
    setEmail(new URLSearchParams(window.location.search).get('email'));
  }, []);

  const formik = useFormik({
    initialValues: {
      confirmationCode: '',
    },
    validationSchema: codeSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      if (!email) {
        setStatus('Email is required');
        return;
      }

      setLoading(true);
      try {
        // Navigate to password change page with code and email
        const params = new URLSearchParams();
        params.append('email', email);
        params.append('code', values.confirmationCode);
        navigate({
          pathname:
            currentLayout?.name === 'auth-branded'
              ? '/auth/reset-password/change'
              : '/auth/classic/reset-password/change',
          search: params.toString(),
        });
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          setStatus(error.response.data.message);
        } else {
          setStatus('Failed to proceed. Please try again.');
        }
        setSubmitting(false);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleResend = async () => {
    if (!email) return;

    setResending(true);
    setResendStatus(undefined);
    try {
      if (!requestPasswordResetLink) {
        throw new Error('Password reset service is not available');
      }
      await requestPasswordResetLink(email);
      setResendStatus('Verification code resent! Please check your email.');
      formik.setFieldValue('confirmationCode', '');
    } catch (error: any) {
      setResendStatus(error.message || 'Failed to resend verification code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="card max-w-[440px] w-full">
      <div className="card-body p-10">
        <div className="flex justify-center py-6">
          <img
            src={toAbsoluteUrl('/media/illustrations/30.svg')}
            className="dark:hidden max-h-[130px]"
            alt=""
          />
          <img
            src={toAbsoluteUrl('/media/illustrations/30-dark.svg')}
            className="light:hidden max-h-[130px]"
            alt=""
          />
        </div>

        <h3 className="text-lg font-medium text-gray-900 text-center mb-3">
          Check your email
        </h3>
        <div className="text-2sm text-center text-gray-700 mb-6">
          We've sent a verification code to{' '}
          <span className="text-gray-800 font-medium">{email}</span>
          <br />
          Enter the code below to reset your password.
        </div>

        {formik.status && <Alert variant="danger">{formik.status}</Alert>}
        {resendStatus && (
          <Alert
            variant={resendStatus.includes('resent') ? 'success' : 'danger'}
          >
            {resendStatus}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900">
              Verification Code
            </label>
            <label className="input">
              <input
                type="text"
                placeholder="Enter verification code"
                autoComplete="off"
                {...formik.getFieldProps('confirmationCode')}
                className={clsx('form-control bg-transparent', {
                  'is-invalid':
                    formik.touched.confirmationCode &&
                    formik.errors.confirmationCode,
                })}
              />
            </label>
            {formik.touched.confirmationCode &&
              formik.errors.confirmationCode && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.confirmationCode}
                </span>
              )}
          </div>

          <button
            type="submit"
            className="btn btn-primary flex justify-center grow"
            disabled={loading || formik.isSubmitting}
          >
            {loading ? 'Please wait...' : 'Continue'}
          </button>
        </form>

        <div className="flex items-center justify-center gap-1 mt-5">
          <span className="text-xs text-gray-600">
            Didn't receive an email?
          </span>
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-xs font-medium link"
          >
            {resending ? 'Sending...' : 'Resend'}
          </button>
        </div>

        <div className="flex justify-center mt-5">
          <Link
            to={
              currentLayout?.name === 'auth-branded'
                ? '/auth/login'
                : '/auth/classic/login'
            }
            className="text-sm text-gray-600 hover:text-primary"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export { ResetPasswordCheckEmail };
