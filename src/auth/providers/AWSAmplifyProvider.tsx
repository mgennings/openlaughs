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
        const attributes = await fetchUserAttributes();

        // Create auth model from Cognito session
        const authModel: AuthModel = {
          access_token: 'cognito-session', // Amplify handles tokens internally
          api_token: 'cognito-session',
        };

        // Create user model from Cognito attributes
        const userModel: UserModel = {
          id: 0, // Will be set from user attributes if available
          username: attributes.email || user.username || '',
          password: undefined,
          email: attributes.email || '',
          first_name: attributes.given_name || attributes.name || '',
          last_name: attributes.family_name || '',
          fullname:
            attributes.name ||
            `${attributes.given_name || ''} ${attributes.family_name || ''}`.trim(),
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
      saveAuth(undefined);
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
        register,
        confirmRegistration,
        resendConfirmationCode,
        requestPasswordResetLink,
        resetPassword,
        changePassword,
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
