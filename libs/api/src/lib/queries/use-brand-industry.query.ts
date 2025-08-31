import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { requestWithStringError } from '../utils/request';
import {
  BrandIndustry,
  BrandIndustryServiceType,
} from '../types/brand-industry';

export enum BrandIndustryQueryKey {
  list = 'brand-industry-list',
  serviceTypeList = 'brand-industry-service-type-list',
}

export const useBrandIndustryQuery = () =>
  useQuery<BrandIndustry[], string>({
    queryKey: [BrandIndustryQueryKey.list],
    queryFn: () => requestWithStringError(axios.get('/api/brand-industry')),
  });

export const useBrandIndustryServiceTypeQuery = () =>
  useQuery<BrandIndustryServiceType[], string>({
    queryKey: [BrandIndustryQueryKey.serviceTypeList],
    queryFn: () =>
      requestWithStringError(axios.get('/api/brand-industry/service-type')),
  });
