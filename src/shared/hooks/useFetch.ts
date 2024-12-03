import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/shared/config/config';

export const useFetch = <T>(queryKey: string[], url: string) => {
  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(url);
        const pagination = {
          limit: response.headers['x-pagination-limit'],
          page: response.headers['x-pagination-page'],
          pages: response.headers['x-pagination-pages'],
          total: response.headers['x-pagination-total'],
        };
        return { data: response.data, pagination };
      } catch (error: any) {
        if (error.response?.status === 404) {
          return { data: [], pagination: {} };
        }
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};
