import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useAuthStatus() {
  return useQuery({
    queryKey: ['auth-status'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/auth/me');
        return { user: data };
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
} 