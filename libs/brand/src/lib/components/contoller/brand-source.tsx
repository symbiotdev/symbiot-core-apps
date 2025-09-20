import { BrandSourceOption } from '@symbiot-core-apps/api';
import {
  Input,
  onChangeInput,
  PickerOnChange,
  SelectPicker,
} from '@symbiot-core-apps/ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'tamagui';

type FormValue = {
  source: string | null;
};

export const BrandSource = ({
  source,
  options,
  optionsLoading,
  optionsError,
  label,
  placeholder,
  customPlaceholder,
  onUpdate,
  onBlur,
}: FormValue & {
  label: string;
  placeholder: string;
  customPlaceholder: string;
  options?: BrandSourceOption[];
  optionsLoading?: boolean;
  optionsError?: string | null;
  onUpdate: (source: string | null) => void;
  onBlur?: () => void;
}) => {
  const [sourceId, setSourceId] = useState<string | undefined>(undefined);
  const [customSource, setCustomSource] = useState<string | undefined>(
    undefined,
  );

  const sourceAppliedRef = useRef(false);

  const onChangeReferralSource = useCallback(
    (newSource: string) => {
      if (!options || sourceId === newSource) return;

      setSourceId(newSource);

      if (options.find((referral) => referral.value === newSource)?.free) {
        setCustomSource('');
        onUpdate('');
      } else {
        setCustomSource(undefined);
        onUpdate(newSource);
      }
    },
    [options, sourceId, onUpdate],
  );

  const onChangeCustomSource = useCallback(
    (source: string) => {
      setCustomSource(source);
      onUpdate(source);
    },
    [onUpdate],
  );

  useEffect(() => {
    if (!options || sourceAppliedRef.current) return;

    sourceAppliedRef.current = true;

    if (source) {
      const currentSource = options?.find(({ value }) => value === source);
      const isFreeSelected = !currentSource || !!currentSource?.free;

      if (isFreeSelected) {
        setSourceId(options?.find(({ free }) => free)?.value);
        setCustomSource(source);
      } else {
        setSourceId(currentSource?.value);
        setCustomSource(undefined);
      }
    } else {
      setSourceId(undefined);
      setCustomSource(undefined);
    }
  }, [source, options]);

  return (
    <View gap="$2">
      <SelectPicker
        value={sourceId}
        options={options}
        optionsLoading={optionsLoading}
        optionsError={optionsError}
        label={label}
        sheetLabel={label}
        placeholder={placeholder}
        onChange={onChangeReferralSource as PickerOnChange}
        onBlur={onBlur}
      />

      {customSource !== undefined && (
        <Input
          autoCapitalize="words"
          enterKeyHint="done"
          value={customSource}
          placeholder={customPlaceholder}
          onChange={onChangeCustomSource as onChangeInput}
          onBlur={onBlur}
        />
      )}
    </View>
  );
};
