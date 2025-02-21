'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { useLogin, useRegister, useLogout } from '@/hooks/useAuth';

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
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const login = async (email: string, password: string) => {
    const result = await loginMutation.mutateAsync({ email, password });
    setUser(result.user);
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