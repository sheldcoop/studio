
'use client';

import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
  type ConfirmationResult,
  type AuthError,
  type User,
} from 'firebase/auth';
import { useFirebaseAuth, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';

const googleProvider = new GoogleAuthProvider();

export const getFriendlyErrorMessage = (error: AuthError): string => {
    switch (error.code) {
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Invalid credentials. Please check your email and password.';
        case 'auth/email-already-in-use':
            return 'An account with this email address already exists.';
        case 'auth/weak-password':
            return 'The password must be at least 6 characters long.';
        case 'auth/popup-closed-by-user':
            return 'The sign-in popup was closed before completion. Please try again.';
        case 'auth/requires-recent-login':
            return 'This operation is sensitive and requires recent authentication. Please log in again before retrying.';
        case 'auth/too-many-requests':
            return 'We have detected too many requests from your device. Please wait a while before trying again.';
        case 'auth/invalid-phone-number':
            return 'The phone number is not valid.';
        case 'auth/captcha-check-failed':
        case 'auth/invalid-app-credential':
            return 'The reCAPTCHA verification failed. Please try again.';
        default:
            console.error("Authentication Error:", error);
            return 'An unexpected authentication error occurred. Please try again later.';
    }
}

const writeUserToFirestore = async (firestore: any, user: User) => {
    if (!firestore) return;
    const userRef = doc(firestore, "users", user.uid);
    const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
    };
    await setDoc(userRef, userData, { merge: true });
};

const actionCodeSettings = {
  url: `${typeof window !== 'undefined' ? window.location.origin : ''}/actions`,
  handleCodeInApp: true,
};


interface AuthContextType {
  user: User | null;
  loading: boolean;
  handleAuthAction: (action: 'signUp' | 'signIn', email: string, password?: string, displayName?: string) => Promise<{ success: boolean; message: string; }>;
  handlePasswordReset: (email: string) => Promise<{ success: boolean; message: string; }>;
  handleGoogleSignIn: () => Promise<{ success: boolean; message: string; }>;
  handleSendSignInLink: (email: string) => Promise<{ success: boolean; message: string; }>;
  setupRecaptcha: (containerId: string) => RecaptchaVerifier;
  handlePhoneSignIn: (phoneNumber: string, appVerifier: RecaptchaVerifier) => Promise<{ success: boolean; message: string; confirmationResult?: ConfirmationResult }>;
  handleVerifyPhoneCode: (confirmationResult: ConfirmationResult, code: string) => Promise<{ success: boolean; message: string; }>;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useFirebaseAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
       if (user) {
         router.push('/');
      }
    });

    return () => unsubscribe();
  }, [auth, router]);
  

  const handleAuthAction = async (action: 'signUp' | 'signIn', email: string, password = '', displayName?: string): Promise<{ success: boolean; message: string; }> => {
    if (!auth) return { success: false, message: 'Authentication service not available.'};
    try {
      let userCredential;
      if (action === 'signUp') {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName && userCredential.user) {
          await updateProfile(userCredential.user, { displayName });
        }
      } else { // signIn
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      
      await writeUserToFirestore(firestore, userCredential.user);
      return { success: true, message: 'Login successful!' };
      
    } catch (err) {
      return { success: false, message: getFriendlyErrorMessage(err as AuthError) };
    }
  };

  const handleSendSignInLink = async (email: string): Promise<{ success: boolean; message: string; }> => {
    if (!auth) return { success: false, message: 'Authentication service not available.'};
    if (!email) {
      return { success: false, message: 'Please enter your email address.'};
    }
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      return { success: true, message: 'A sign-in link has been sent to your email. Please check your inbox.' };
    } catch (err) {
      return { success: false, message: getFriendlyErrorMessage(err as AuthError) };
    }
  };

  const handlePasswordReset = async (email: string): Promise<{ success: boolean; message: string; }> => {
    if (!auth) return { success: false, message: 'Authentication service not available.'};
    if (!email) {
      return { success: false, message: 'Please enter your email address to reset your password.'};
    }
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: 'A password reset link has been sent to your email address.' };
    } catch (err) {
        return { success: false, message: getFriendlyErrorMessage(err as AuthError) };
    }
  };

  const handleGoogleSignIn = async (): Promise<{ success: boolean; message: string; }> => {
    if (!auth) return { success: false, message: 'Authentication service not available.'};
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      await writeUserToFirestore(firestore, userCredential.user);
      return { success: true, message: 'Login successful!' };
    } catch (err) {
      return { success: false, message: getFriendlyErrorMessage(err as AuthError) };
    }
  }

  const setupRecaptcha = useCallback((containerId: string): RecaptchaVerifier => {
      if (!auth) throw new Error("Firebase auth not initialized");
      const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible'
      });
      return recaptchaVerifier;
  }, [auth]);


  const handlePhoneSignIn = async (phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<{ success: boolean; message: string; confirmationResult?: ConfirmationResult }> => {
    if (!auth) return { success: false, message: 'Authentication service not available.' };
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      return { success: true, message: 'SMS sent!', confirmationResult };
    } catch (error) {
      return { success: false, message: getFriendlyErrorMessage(error as AuthError) };
    }
  };

  const handleVerifyPhoneCode = async (confirmationResult: ConfirmationResult, code: string): Promise<{ success: boolean; message: string; }> => {
    try {
      const result = await confirmationResult.confirm(code);
      await writeUserToFirestore(firestore, result.user);
      return { success: true, message: 'Sign in successful!' };
    } catch (error) {
      return { success: false, message: getFriendlyErrorMessage(error as AuthError) };
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };


  return (
    <AuthContext.Provider value={{ user, loading, handleAuthAction, handlePasswordReset, handleGoogleSignIn, handleSendSignInLink, setupRecaptcha, handlePhoneSignIn, handleVerifyPhoneCode, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
