
'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

const auth = getAuth(app);

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show a full-page loading skeleton while verifying auth state
  if (loading) {
    return (
        <div className="flex h-screen w-full flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 p-4">
                <Skeleton className="h-8 w-full max-w-7xl mx-auto" />
            </header>
            <main className="flex-1 p-4 md:p-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    <Skeleton className="h-16 w-1/3" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </main>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
