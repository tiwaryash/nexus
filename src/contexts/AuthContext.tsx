'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLogin, useRegister, useLogout, useAuthStatus } from '@/hooks/useAuth';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const authStatus = useAuthStatus();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (authStatus.data) {
      setUser(authStatus.data.user);
    }
  }, [authStatus.data]);

  if (!mounted) {
    return null;
  }

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      setUser(result.user);
      await Promise.resolve();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    const result = await registerMutation.mutateAsync({ email, password, name });
    setUser(result.user);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    setUser(null);
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 