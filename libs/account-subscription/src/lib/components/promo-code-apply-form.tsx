import { useApplyPartnerPromoCodeReq } from '@symbiot-core-apps/api';
import { Button, CompactView } from '@symbiot-core-apps/ui';
import React, { useCallback, useState } from 'react';
import { useI18n } from '@symbiot-core-apps/shared';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import { Input, onChangeInput } from '@symbiot-core-apps/form-controller';

export const PromoCodeApplyForm = ({
  onApplied,
}: {
  onApplied: () => void;
}) => {
  const { t } = useI18n();
  const { mergeMe } = useCurrentAccountState();
  const { mutateAsync, isPending, error } = useApplyPartnerPromoCodeReq();

  const [promoCode, setPromoCode] = useState('');

  const apply = useCallback(async () => {
    const { offering, benefits } = await mutateAsync({ promoCode });

    mergeMe({
      offering,
      privileged: true,
      offeredPrivileges: benefits,
    });

    onApplied();
  }, [mutateAsync, promoCode, mergeMe, onApplied]);

  return (
    <CompactView gap={20}>
      <Input
        required
        enterKeyHint="done"
        regex={/^[a-zA-Z0-9_]+$/}
        value={promoCode}
        autofocus
        label={t('shared.referral_program.promo_code.form.code.label')}
        placeholder={t(
          'shared.referral_program.promo_code.form.code.placeholder',
        )}
        error={
          error
            ? t('shared.referral_program.promo_code.form.code.error.invalid')
            : undefined
        }
        onChange={setPromoCode as onChangeInput}
      />

      <Button
        loading={isPending}
        disabled={!promoCode || promoCode.length < 3}
        label={t('shared.apply')}
        onPress={apply}
      />
    </CompactView>
  );
};
