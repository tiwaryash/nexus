'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLogin, useRegister, useLogout } from '@/hooks/useAuth';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import api from '@/lib/api';
import type { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const { data: authData, isLoading: authLoading } = useAuthStatus();

  useEffect(() => {
    if (authData?.user) {
      setUser(authData.user);
    } else {
      setUser(null);
    }
  }, [authData]);

  const login = async (email: string, password: string) => {
    try {
      console.log("AuthContext: Starting login process");
      const result = await loginMutation.mutateAsync({ email, password });
      console.log("AuthContext: Login mutation successful:", result);
      
      localStorage.setItem('token', result.access_token);
      setUser(result.user);
      
      return result;
    } catch (error) {
      console.error("AuthContext: Login error:", error);
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

  const isLoading = loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending || authLoading;

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