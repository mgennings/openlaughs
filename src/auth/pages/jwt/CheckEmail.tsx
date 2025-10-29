import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';

import { toAbsoluteUrl } from '@/utils';
import { useAuthContext } from '@/auth';
import { useState } from 'react';
import { Alert } from '@/components';

const confirmationSchema = Yup.object().shape({
  confirmationCode: Yup.string()
    .required('Confirmation code is required')
    .matches(/^\d{6}$/, 'Code must be 6 digits'),
});

const initialValues = {
  confirmationCode: '',
};

const CheckEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'your email';
  const { confirmRegistration, resendConfirmationCode } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | undefined>();

  const formik = useFormik({
    initialValues,
    validationSchema: confirmationSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      if (!email || email === 'your email') {
        setStatus('Email is required for verification');
        return;
      }

      setLoading(true);
      try {
        if (!confirmRegistration) {
          throw new Error('AWSAmplifyProvider is required for this form.');
        }

        await confirmRegistration(email, values.confirmationCode);

        // Success! Redirect to login page (user needs to sign in after verification)
        navigate('/auth/login', {
          replace: true,
          state: { message: 'Account verified! Please sign in.' },
        });
      } catch (error: any) {
        console.error('Confirmation error:', error);
        let errorMessage = 'Invalid confirmation code. Please try again.';
        if (error.message) {
          if (error.message.includes('CodeMismatchException')) {
            errorMessage =
              'Invalid confirmation code. Please check and try again.';
          } else if (error.message.includes('ExpiredCodeException')) {
            errorMessage =
              'This confirmation code has expired. Please request a new one.';
          } else {
            errorMessage = error.message;
          }
        }
        setStatus(errorMessage);
        setSubmitting(false);
      }
      setLoading(false);
    },
  });

  const handleResend = async () => {
    if (!email || email === 'your email') return;

    setResending(true);
    setResendStatus(undefined);
    try {
      await resendConfirmationCode(email);
      setResendStatus('Confirmation code resent! Please check your email.');
      formik.setFieldValue('confirmationCode', ''); // Clear the input
    } catch (error: any) {
      setResendStatus(error.message || 'Failed to resend confirmation code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="card max-w-[440px] w-full">
      <div className="card-body p-10">
        <div className="flex justify-center py-10">
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
          Check your email 🎭
        </h3>
        <div className="text-2sm text-center text-gray-700 mb-5">
          We've sent a confirmation code to&nbsp;
          <span className="text-2sm text-gray-900 font-medium">{email}</span>
          <br />
          Please enter the 6-digit code to verify your OpenLaughs account.
        </div>

        {formik.status && (
          <Alert variant="danger" className="mb-5">
            {formik.status}
          </Alert>
        )}

        {resendStatus && (
          <Alert
            variant={resendStatus.includes('resent') ? 'primary' : 'danger'}
            className="mb-5"
          >
            {resendStatus}
          </Alert>
        )}

        <form
          className="flex flex-col gap-5"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div className="flex flex-col gap-1">
            <label className="form-label text-gray-900">
              Confirmation Code
            </label>
            <label className="input">
              <input
                type="text"
                placeholder="Enter 6-digit code"
                autoComplete="off"
                maxLength={6}
                {...formik.getFieldProps('confirmationCode')}
                className={clsx(
                  'form-control text-center text-2xl tracking-widest font-semibold',
                  {
                    'is-invalid':
                      formik.touched.confirmationCode &&
                      formik.errors.confirmationCode,
                  },
                )}
                onChange={e => {
                  // Only allow digits
                  const value = e.target.value.replace(/\D/g, '');
                  formik.setFieldValue('confirmationCode', value);
                }}
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
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>

        <div className="flex items-center justify-center gap-1 mt-5">
          <span className="text-xs text-gray-700">Didn't receive a code?</span>
          <button
            onClick={handleResend}
            disabled={resending || !email || email === 'your email'}
            className="text-xs font-medium link disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? 'Resending...' : 'Resend'}
          </button>
        </div>

        <div className="flex justify-center mt-5">
          <Link to="/" className="text-xs text-gray-500 hover:text-gray-700">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export { CheckEmail };
