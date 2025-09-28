
'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';

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

// These routes are publicly accessible and don't require authentication.
const PUBLIC_ROUTES = ['/login', '/reset-password', '/actions'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // The homepage is always public, serving as the entry for guests.
      const isPublic = PUBLIC_ROUTES.includes(pathname) || pathname === '/';

      // If the user is not logged in and is trying to access a protected page,
      // redirect them to the login page.
      if (!user && !isPublic) {
        router.push('/login');
      }
      
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);


  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
