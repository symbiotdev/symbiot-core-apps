import { useAppReferralsQuery } from '@symbiot-core-apps/api';
import {
  Input,
  onChangeInput,
  PickerOnChange,
  SelectPicker,
} from '@symbiot-core-apps/ui';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'tamagui';

type FormValue = {
  source: string;
};

export const BrandSource = ({
  referralSource,
  label,
  placeholder,
  customPlaceholder,
  onUpdate,
}: {
  referralSource?: string;
  label: string;
  placeholder: string;
  customPlaceholder: string;
  onUpdate: (value: FormValue) => void;
}) => {
  const {
    data: referrals,
    isPending: referralsLoading,
    error: referralsError,
  } = useAppReferralsQuery();

  const [sourceId, setSourceId] = useState<string | undefined>(undefined);
  const [customSource, setCustomSource] = useState<string | undefined>(
    undefined,
  );

  const onCustomSourceBlur = useCallback(() => {
    if (!customSource) return;

    onUpdate({ source: customSource.trim() });
  }, [onUpdate, customSource]);

  const onChangeReferralSource = useCallback(
    (newSource: string) => {
      if (!referrals || referralSource === newSource) return;

      setSourceId(newSource);

      if (referrals.find((referral) => referral.value === newSource)?.free) {
        setCustomSource((prev) => prev || '');
      } else {
        setCustomSource(undefined);
        onUpdate({ source: newSource });
      }
    },
    [onUpdate, referralSource, referrals],
  );

  useEffect(() => {
    if (!referrals) return;

    if (referralSource) {
      const currentSource = referrals?.find(
        ({ value }) => value === referralSource,
      );
      const isFreeSelected = !currentSource || !!currentSource?.free;

      if (isFreeSelected) {
        setSourceId(referrals?.find(({ free }) => free)?.value);
        setCustomSource(referralSource);
      } else {
        setSourceId(currentSource?.value);
        setCustomSource(undefined);
      }
    } else {
      setSourceId(undefined);
      setCustomSource(undefined);
    }
  }, [referralSource, referrals]);

  return (
    <View gap="$2">
      <SelectPicker
        value={sourceId}
        options={referrals}
        optionsLoading={referralsLoading}
        optionsError={referralsError}
        label={label}
        sheetLabel={label}
        placeholder={placeholder}
        onChange={onChangeReferralSource as PickerOnChange}
      />

      {customSource !== undefined && (
        <Input
          autoCapitalize="words"
          enterKeyHint="done"
          value={customSource}
          placeholder={customPlaceholder}
          onChange={setCustomSource as onChangeInput}
          onBlur={onCustomSourceBlur}
        />
      )}
    </View>
  );
};
