import { useQuery } from '../hooks/use-query';
import { Partner } from '../types/partner';
import { useMutation } from '../hooks/use-mutation';
import axios from 'axios';

export enum PartnerQueryKey {
  promoCodeBenefits = 'promo-code-benefits',
}

export const usePartnerPromoCodeBenefitsQuery = ({
  enabled,
  promoCode,
}: {
  enabled: boolean;
  promoCode: string;
}) =>
  useQuery<Pick<Partner, 'benefits'>, string>({
    enabled,
    retry: false,
    queryKey: [PartnerQueryKey.promoCodeBenefits, promoCode],
    url: `/api/partner/promo-code/${promoCode}/benefits`,
  });

export const useApplyPartnerPromoCodeReq = () =>
  useMutation<
    Pick<Partner, 'benefits' | 'offering'>,
    string,
    { promoCode: string }
  >({
    mutationFn: (data) => axios.post(`/api/partner/promo-code/apply`, data),
  });
