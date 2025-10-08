
'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { initializeFirebase, type FirebaseApp, type Auth, type Firestore } from './index';
import { FirebaseProvider } from './provider';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [firebase, setFirebase] = useState<{
    app: FirebaseApp | null;
    auth: Auth | null;
    firestore: Firestore | null;
  }>({
    app: null,
    auth: null,
    firestore: null,
  });

  useEffect(() => {
    // This ensures Firebase is initialized only on the client side.
    const { app, auth, firestore } = initializeFirebase();
    setFirebase({ app, auth, firestore });
  }, []);

  return <FirebaseProvider {...firebase}>{children}</FirebaseProvider>;
}
