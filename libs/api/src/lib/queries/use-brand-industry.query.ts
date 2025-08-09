import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { requestWithStringError } from '../utils/request';
import { BrandIndustry } from '../types/brand-industry';

export const useBrandIndustryQuery = () =>
  useQuery<BrandIndustry[], string>({
    queryKey: ['brand-industry'],
    queryFn: () => requestWithStringError(axios.get('/api/brand-industry')),
  });
