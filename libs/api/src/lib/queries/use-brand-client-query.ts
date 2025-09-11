import { useInfiniteQueryWrapper } from '../hooks/use-infinite-query-wrapper';
import { PaginationList } from '../types/pagination';
import { BrandClient, CreateBrandClient } from '../types/brand-client';
import { useMutation } from '@tanstack/react-query';
import { requestWithAlertOnError } from '../utils/request';
import axios from 'axios';
import { generateFormData } from '../utils/media';
import { queryClient } from '../utils/client';

export enum BrandClientQueryKey {
  currentList = 'brand-client-current-list',
  detailedById = 'brand-client-detailed-by-id',
}

export const useCurrentBrandClientListQuery = (
  props: {
    initialState?: PaginationList<BrandClient>;
    setInitialState?: (state: PaginationList<BrandClient>) => void;
  } = {},
) =>
  useInfiniteQueryWrapper({
    apUrl: '/api/brand-client',
    queryKey: [BrandClientQueryKey.currentList],
    ...props,
  });

export const useCreateBrandClientQuery = () =>
  useMutation<BrandClient, string, CreateBrandClient>({
    mutationFn: async (data) => {
      const client = await requestWithAlertOnError<BrandClient>(
        axios.post(
          `/api/brand-client/add`,
          await generateFormData<CreateBrandClient>(data, ['avatar']),
        ),
      );

      queryClient.setQueryData(
        [BrandClientQueryKey.detailedById, client.id],
        client,
      );
      await queryClient.refetchQueries({
        queryKey: [BrandClientQueryKey.currentList],
      });

      return client;
    },
  });
