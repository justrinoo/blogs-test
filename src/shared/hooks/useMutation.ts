import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/shared/config/config';

type MutationParams<T> = {
  url: string;
  data?: T;
};

export const useMutationHandler = <T, R>(
  method: 'post' | 'put' | 'delete',
  onSuccessCallback?: () => void,
  onErrorCallback?: (error: unknown) => void
) => {
  const queryClient = useQueryClient();

  return useMutation<R, unknown, MutationParams<T>>(
    async ({ url, data }: MutationParams<T>) => {
      switch (method) {
        case 'post':
          return (await axiosInstance.post(url, data)).data;
        case 'put':
          return (await axiosInstance.put(url, data)).data;
        case 'delete':
          return (await axiosInstance.delete(url)).data;
        default:
          throw new Error('Invalid method');
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
        if (onSuccessCallback) onSuccessCallback();
      },
      onError: (error: unknown) => {
        if (onErrorCallback) onErrorCallback(error);
      },
    }
  );
};
