'use client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { LoginResponse, AuthError } from '@/types/auth';
import { useRouter } from 'next/navigation';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export const useAuthStatus = () => {
  return useQuery({
    queryKey: ['auth-status'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/auth/me');
        return data;
      } catch (error) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        throw error;
      }
    },
    retry: false,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token')
  });
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    const router = useRouter(); 
    console.log("okokokok",router);
  
    return useMutation<LoginResponse, AuthError, { email: string; password: string }>({
      mutationFn: async (credentials) => {
        try {
          const { data } = await api.post('/auth/login', credentials);
          console.log("Raw API Response:", data);

          
          return data;
        } catch (error: any) {
          if (error.response?.status === 401) {
            throw new Error('Incorrect email or password');
          }
          throw error;
        }
      },
      onSuccess: (data) => {
        console.log(data);
        localStorage.setItem('token', data.access_token);
        queryClient.setQueryData(['user'], data.user);
        console.log("BALLAL", queryClient.getQueryData(['user'])); // This should log the updated user data
        console.log("Login success, user data:", data.user);

                router.push('/dashboard');
      },
      onError: (error) => {
        localStorage.removeItem('token');
        throw error;
      }
    });
  };
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const { data } = await api.post('/auth/register', credentials);
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      queryClient.setQueryData(['user'], null);
    }
  });
}; 