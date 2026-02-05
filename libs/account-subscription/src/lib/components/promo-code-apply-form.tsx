import { useApplyPartnerPromoCodeReq } from '@symbiot-core-apps/api';
import { Button, CompactView } from '@symbiot-core-apps/ui';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useI18n } from '@symbiot-core-apps/shared';
import { PromoCodeController } from './promo-code-controller';
import { useCurrentAccountState } from '@symbiot-core-apps/state';

export const PromoCodeApplyForm = ({ onApplied }: { onApplied: () => void }) => {
  const { t } = useI18n();
  const { mergeMe } = useCurrentAccountState();
  const { mutateAsync, isPending } = useApplyPartnerPromoCodeReq();
  const { control, handleSubmit } = useForm<{ promoCode: string }>({
    defaultValues: { promoCode: '' },
  });

  const [isPromoCodeValid, setIsPromoCodeValid] = useState(false);

  const apply = useCallback(
    async ({ promoCode }: { promoCode: string }) => {
      if (!isPromoCodeValid) return;

      const { offering, benefits } = await mutateAsync({ promoCode });

      mergeMe({
        offering,
        privileged: true,
        offeredPrivileges: benefits,
      });

      onApplied();
    },
    [isPromoCodeValid, mutateAsync, mergeMe, onApplied],
  );

  return (
    <CompactView gap={20} marginVertical="auto">
      <PromoCodeController
        autofocus
        name="promoCode"
        control={control}
        onCheckValidity={setIsPromoCodeValid}
      />

      {isPromoCodeValid && (
        <Button
          loading={isPending}
          label={t('shared.apply')}
          onPress={handleSubmit(apply)}
        />
      )}
    </CompactView>
  );
};
