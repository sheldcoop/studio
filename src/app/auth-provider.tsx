'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  handleLogout: () => Promise<void>;
  refreshUser: () => Promise<void>; // ADDED
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/user');
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // CHANGED: Remove pathname dependency
  useEffect(() => {
    fetchUser();
  }, []); // Only fetch once on mount

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
      router.refresh(); // ADDED - forces route refresh
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // ADDED: Manual refresh function
  const refreshUser = async () => {
    await fetchUser();
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, handleLogout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
