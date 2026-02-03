import { useQuery } from '../hooks/use-query';
import { Partner } from '../types/partner';

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
