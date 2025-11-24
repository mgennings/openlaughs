import { type MouseEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { KeenIcon } from '@/components';
import { toAbsoluteUrl } from '@/utils';
import { useAuthContext } from '@/auth';
import { useLayout } from '@/providers';
import { Alert } from '@/components';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  remember: Yup.boolean(),
});

const initialValues = {
  email: '',
  password: '',
  remember: false,
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, loginWithApple } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const successMessage = location.state?.message;
  const [showPassword, setShowPassword] = useState(false);
  const { currentLayout } = useLayout();

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);

      try {
        if (!login) {
          throw new Error('AWSAmplifyProvider is required for this form.');
        }

        await login(values.email, values.password);

        if (values.remember) {
          localStorage.setItem('email', values.email);
        } else {
          localStorage.removeItem('email');
        }

        // Redirect to dashboard after successful login
        navigate('/dashboard', { replace: true });
      } catch (error: any) {
        console.error('Login error:', error);

        // Handle NEW_PASSWORD_REQUIRED challenge
        if (
          error.name === 'NewPasswordRequiredException' ||
          error.message === 'NEW_PASSWORD_REQUIRED' ||
          error.challengeName === 'NEW_PASSWORD_REQUIRED'
        ) {
          // Extract session from error or use the one provided
          const session = error.session || error.Session;
          const email = error.email || values.email;

          // Redirect to force change password page
          navigate(
            currentLayout?.name === 'auth-branded'
              ? '/auth/force-change-password'
              : '/auth/classic/force-change-password',
            {
              replace: true,
              state: {
                session,
                email,
              },
            },
          );
          return;
        }

        // Handle specific Cognito errors
        let errorMessage = 'The login details are incorrect';
        if (error.message) {
          if (error.message.includes('UserNotConfirmedException')) {
            errorMessage =
              'Please verify your email address. Check your inbox for a confirmation code.';
          } else if (error.message.includes('NotAuthorizedException')) {
            errorMessage = 'Incorrect email or password. Please try again.';
          } else if (error.message.includes('UserNotFoundException')) {
            errorMessage = 'No account found with this email address.';
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

  const handleGoogleLogin = async () => {
    if (!loginWithGoogle) return;

    try {
      setLoading(true);
      await loginWithGoogle(); // will redirect to Cognito Hosted UI
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    if (!loginWithApple) return;

    try {
      setLoading(true);
      await loginWithApple(); // will redirect to Cognito Hosted UI
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="card max-w-[420px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-5 md:p-10"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="text-center mb-2.5">
          <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">
            Welcome Back to OpenLaughs 🎭
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Austin's Comedy Scene, Amplified
          </p>
          <div className="flex items-center justify-center font-medium">
            <span className="text-2sm text-gray-600 me-1.5">
              Need an account?
            </span>
            <Link
              to={
                currentLayout?.name === 'auth-branded'
                  ? '/auth/signup'
                  : '/auth/classic/signup'
              }
              className="text-2sm link"
            >
              Sign up
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn btn-light btn-sm justify-center p-1 md:p-2"
            disabled={loading || formik.isSubmitting}
          >
            <img
              src={toAbsoluteUrl('/media/brand-logos/google.svg')}
              className="size-3.5 shrink-0"
            />
            Sign In with Google
          </button>

          <button
            type="button"
            onClick={handleAppleLogin}
            className="btn btn-light btn-sm justify-center p-1 md:p-2"
            disabled={loading || formik.isSubmitting}
          >
            <img
              src={toAbsoluteUrl('/media/brand-logos/apple-black.svg')}
              className="size-3.5 shrink-0 dark:hidden"
            />
            <img
              src={toAbsoluteUrl('/media/brand-logos/apple-white.svg')}
              className="size-3.5 shrink-0 light:hidden"
            />
            Sign In with Apple
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="border-t border-gray-200 w-full"></span>
          <span className="text-2xs text-gray-500 font-medium uppercase">
            Or
          </span>
          <span className="border-t border-gray-200 w-full"></span>
        </div>

        {successMessage && <Alert variant="primary">{successMessage}</Alert>}
        {formik.status && <Alert variant="danger">{formik.status}</Alert>}

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Email</label>
          <label className="input">
            <input
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              {...formik.getFieldProps('email')}
              className={clsx('form-control', {
                'is-invalid': formik.touched.email && formik.errors.email,
              })}
            />
          </label>
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-1">
            <label className="form-label text-gray-900">Password</label>
            <Link
              to={
                currentLayout?.name === 'auth-branded'
                  ? '/auth/reset-password'
                  : '/auth/classic/reset-password'
              }
              className="text-2sm link shrink-0"
            >
              Forgot Password?
            </Link>
          </div>
          <label className="input">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              {...formik.getFieldProps('password')}
              className={clsx('form-control', {
                'is-invalid': formik.touched.password && formik.errors.password,
              })}
            />
            <button className="btn btn-icon" onClick={togglePassword}>
              <KeenIcon
                icon="eye"
                className={clsx('text-gray-500', { hidden: showPassword })}
              />
              <KeenIcon
                icon="eye-slash"
                className={clsx('text-gray-500', { hidden: !showPassword })}
              />
            </button>
          </label>
          {formik.touched.password && formik.errors.password && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.password}
            </span>
          )}
        </div>

        <label className="checkbox-group">
          <input
            className="checkbox checkbox-sm"
            type="checkbox"
            {...formik.getFieldProps('remember')}
          />
          <span className="checkbox-label">Remember me</span>
        </label>

        <button
          type="submit"
          className="btn btn-primary flex justify-center grow"
          disabled={loading || formik.isSubmitting}
        >
          {loading ? 'Please wait...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export { Login };
