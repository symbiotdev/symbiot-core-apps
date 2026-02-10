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

export const usePartnerApplyPromoCodeReq = () =>
  useMutation<
    Pick<Partner, 'benefits' | 'offering'>,
    string,
    { promoCode: string }
  >({
    mutationFn: (data) => axios.post(`/api/partner/promo-code/apply`, data),
  });

export const usePartnerPromoImage = () =>
  useMutation<ArrayBufferLike, string, { name: string }>({
    showAlert: true,
    mutationFn: (params) =>
      axios.get(`/api/partner/promo-materials/image`, {
        params,
        responseType: 'arraybuffer',
      }),
  });

export const usePartnerPromoPresentation = () =>
  useMutation<ArrayBufferLike, string>({
    showAlert: true,
    mutationFn: () =>
      axios.get(`/api/partner/promo-materials/presentation`, {
        responseType: 'arraybuffer',
      }),
  });
