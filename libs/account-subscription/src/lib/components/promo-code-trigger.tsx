import { Button } from '@symbiot-core-apps/ui';
import React from 'react';
import { ViewProps } from 'tamagui';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import { useI18n } from '@symbiot-core-apps/shared';

export const PromoCodeTrigger = (props: ViewProps) => {
  const { t } = useI18n();
  const { me } = useCurrentAccountState();

  return (
    me?.privileged === false && (
      <Button
        type="clear"
        minHeight="auto"
        width="auto"
        paddingVertical={0}
        paddingHorizontal={0}
        fontSize={14}
        label={t('shared.referral_program.promo_code.exists')}
        {...props}
      />
    )
  );
};
