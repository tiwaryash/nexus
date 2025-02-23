import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useAuthStatus() {
  return useQuery({
    queryKey: ['auth-status'],
    queryFn: async () => {
      console.log("useAuthStatus: Fetching auth status");
      try {
        const { data } = await api.get('/auth/me');
        console.log("useAuthStatus: Received data:", data);
        return { user: data };
      } catch (error) {
        console.error("useAuthStatus: Error fetching status:", error);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        throw error;
      }
    },
    retry: false,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });
} 