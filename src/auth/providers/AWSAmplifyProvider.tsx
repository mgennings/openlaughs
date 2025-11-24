/* eslint-disable no-useless-catch */

import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useEffect,
  useState,
} from 'react';

import {
  signIn,
  signUp,
  signOut as amplifySignOut,
  resetPassword as amplifyResetPassword,
  confirmResetPassword,
  confirmSignUp,
  resendSignUpCode,
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession,
  signInWithRedirect,
  confirmSignIn,
  type SignInOutput,
  type SignUpOutput,
} from 'aws-amplify/auth';

import * as authHelper from '../_helpers';
import { type AuthModel, type UserModel } from '@/auth';

interface AuthContextProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  auth: AuthModel | undefined;
  saveAuth: (auth: AuthModel | undefined) => void;
  currentUser: UserModel | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle?: () => Promise<void>;
  loginWithApple?: () => Promise<void>;
  loginWithFacebook?: () => Promise<void>;
  loginWithGithub?: () => Promise<void>;
  register: (
    email: string,
    password: string,
    password_confirmation: string,
  ) => Promise<SignUpOutput>;
  confirmRegistration: (
    email: string,
    confirmationCode: string,
  ) => Promise<void>;
  resendConfirmationCode: (email: string) => Promise<void>;
  requestPasswordResetLink: (email: string) => Promise<void>;
  resetPassword: (
    email: string,
    confirmationCode: string,
    newPassword: string,
  ) => Promise<void>;
  changePassword: (
    email: string,
    token: string,
    password: string,
    password_confirmation: string,
  ) => Promise<void>;
  confirmSignInWithNewPassword: (
    session: string,
    oldPassword: string,
    newPassword: string,
  ) => Promise<void>;
  getUser: () => Promise<UserModel>;
  logout: () => Promise<void>;
  verify: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken;

        // Create auth model from Cognito session
        const authModel: AuthModel = {
          access_token: 'cognito-session', // Amplify handles tokens internally
          api_token: 'cognito-session',
        };

        // Get user info from ID token (works for both OAuth and regular Cognito users)
        const email =
          (idToken?.payload?.email as string) || user.username || '';
        const name = idToken?.payload?.name as string | undefined;
        const givenName = idToken?.payload?.given_name as string | undefined;
        const familyName = idToken?.payload?.family_name as string | undefined;

        // Create user model from ID token claims
        const userModel: UserModel = {
          id: 0,
          username: email,
          password: undefined,
          email: email,
          first_name: givenName || name || '',
          last_name: familyName || '',
          fullname: name || `${givenName || ''} ${familyName || ''}`.trim(),
        };

        setAuth(authModel);
        setCurrentUser(userModel);
        authHelper.setAuth(authModel);
      } catch (error) {
        // No existing session
        saveAuth(undefined);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const verify = async () => {
    try {
      const user = await getCurrentUser();
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken;

      const authModel: AuthModel = {
        access_token: 'cognito-session',
        api_token: 'cognito-session',
      };

      // Get user info from ID token (works for both OAuth and regular Cognito users)
      const email = (idToken?.payload?.email as string) || user.username || '';
      const name = idToken?.payload?.name as string | undefined;
      const givenName = idToken?.payload?.given_name as string | undefined;
      const familyName = idToken?.payload?.family_name as string | undefined;

      const userModel: UserModel = {
        id: 0,
        username: email,
        password: undefined,
        email: email,
        first_name: givenName || name || '',
        last_name: familyName || '',
        fullname: name || `${givenName || ''} ${familyName || ''}`.trim(),
      };

      setAuth(authModel);
      setCurrentUser(userModel);
      authHelper.setAuth(authModel);
    } catch {
      saveAuth(undefined);
      setCurrentUser(undefined);
    }
  };

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const output = await signIn({ username: email, password });

      // Check if password change is required
      if (
        output.nextStep?.signInStep ===
        'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED'
      ) {
        // Create a custom error that includes the challenge response
        // Note: In AWS Amplify v6, the session is managed internally
        // We just need to indicate that password change is required
        const challengeError: any = new Error('NEW_PASSWORD_REQUIRED');
        challengeError.name = 'NewPasswordRequiredException';
        challengeError.challengeName = 'NEW_PASSWORD_REQUIRED';
        challengeError.email = email;
        // Session is managed internally by Amplify, no need to pass it
        challengeError.session = undefined;
        throw challengeError;
      }

      if (output.isSignedIn) {
        // Fetch user attributes
        const user = await getCurrentUser();
        const attributes = await fetchUserAttributes();

        const authModel: AuthModel = {
          access_token: 'cognito-session',
          api_token: 'cognito-session',
        };

        const userModel: UserModel = {
          id: 0,
          username: attributes.email || user.username || '',
          password: undefined,
          email: attributes.email || '',
          first_name: attributes.given_name || attributes.name || '',
          last_name: attributes.family_name || '',
          fullname:
            attributes.name ||
            `${attributes.given_name || ''} ${attributes.family_name || ''}`.trim(),
        };

        saveAuth(authModel);
        setCurrentUser(userModel);
      } else {
        throw new Error('Sign in not completed');
      }
    } catch (error: any) {
      // Re-throw NEW_PASSWORD_REQUIRED errors as-is
      if (error.name === 'NewPasswordRequiredException') {
        throw error;
      }
      saveAuth(undefined);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Use Amplify's built-in OAuth redirect
      await signInWithRedirect({
        provider: 'Google',
      });
    } catch (error) {
      console.error('Error initiating Google sign in:', error);
      throw error;
    }
  };

  const loginWithApple = async () => {
    try {
      // Use Amplify's built-in OAuth redirect
      await signInWithRedirect({
        provider: 'Apple',
      });
    } catch (error) {
      console.error('Error initiating Apple sign in:', error);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    password_confirmation: string,
  ) => {
    if (password !== password_confirmation) {
      throw new Error("Passwords don't match");
    }

    try {
      const output = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
          autoSignIn: false, // We'll handle confirmation separately
        },
      });

      return output;
    } catch (error: any) {
      throw error;
    }
  };

  const confirmRegistration = async (
    email: string,
    confirmationCode: string,
  ) => {
    try {
      await confirmSignUp({
        username: email,
        confirmationCode,
      });
    } catch (error: any) {
      throw error;
    }
  };

  const resendConfirmationCode = async (email: string) => {
    try {
      await resendSignUpCode({ username: email });
    } catch (error: any) {
      throw error;
    }
  };

  const requestPasswordResetLink = async (email: string) => {
    try {
      await amplifyResetPassword({ username: email });
    } catch (error: any) {
      throw error;
    }
  };

  const resetPassword = async (
    email: string,
    confirmationCode: string,
    newPassword: string,
  ) => {
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode,
        newPassword,
      });
    } catch (error: any) {
      throw error;
    }
  };

  const changePassword = async (
    email: string,
    token: string,
    password: string,
    password_confirmation: string,
  ) => {
    // For Cognito, use resetPassword flow
    // This is kept for backward compatibility but may need to be updated
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: token,
        newPassword: password,
      });
    } catch (error: any) {
      throw error;
    }
  };

  const confirmSignInWithNewPassword = async (
    session: string | undefined,
    oldPassword: string,
    newPassword: string,
  ) => {
    try {
      // In AWS Amplify v6, the session is managed internally
      // We just need to call confirmSignIn with the new password as the challenge response
      const output = await confirmSignIn({
        challengeResponse: newPassword,
      });

      if (output.isSignedIn) {
        // Fetch user attributes after successful sign in
        const user = await getCurrentUser();
        const attributes = await fetchUserAttributes();

        const authModel: AuthModel = {
          access_token: 'cognito-session',
          api_token: 'cognito-session',
        };

        const userModel: UserModel = {
          id: 0,
          username: attributes.email || user.username || '',
          password: undefined,
          email: attributes.email || '',
          first_name: attributes.given_name || attributes.name || '',
          last_name: attributes.family_name || '',
          fullname:
            attributes.name ||
            `${attributes.given_name || ''} ${attributes.family_name || ''}`.trim(),
        };

        saveAuth(authModel);
        setCurrentUser(userModel);
      } else {
        throw new Error('Sign in not completed after password change');
      }
    } catch (error: any) {
      throw error;
    }
  };

  const getUser = async (): Promise<UserModel> => {
    try {
      const user = await getCurrentUser();
      const attributes = await fetchUserAttributes();

      return {
        id: 0,
        username: attributes.email || user.username || '',
        password: undefined,
        email: attributes.email || '',
        first_name: attributes.given_name || attributes.name || '',
        last_name: attributes.family_name || '',
        fullname:
          attributes.name ||
          `${attributes.given_name || ''} ${attributes.family_name || ''}`.trim(),
      };
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await amplifySignOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      saveAuth(undefined);
      setCurrentUser(undefined);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        auth,
        saveAuth,
        currentUser,
        setCurrentUser,
        login,
        loginWithGoogle,
        loginWithApple,
        register,
        confirmRegistration,
        resendConfirmationCode,
        requestPasswordResetLink,
        resetPassword,
        changePassword,
        confirmSignInWithNewPassword,
        getUser,
        logout,
        verify,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
