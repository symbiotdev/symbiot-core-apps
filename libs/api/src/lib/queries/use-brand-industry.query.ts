import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { requestWithStringError } from '../utils/request';
import { BrandIndustry } from '../types/brand-industry';

export enum BrandIndustryQueryKey {
  list = 'brand-industry-list',
}

export const useBrandIndustryQuery = () =>
  useQuery<BrandIndustry[], string>({
    queryKey: [BrandIndustryQueryKey.list],
    queryFn: () => requestWithStringError(axios.get('/api/brand-industry')),
  });
