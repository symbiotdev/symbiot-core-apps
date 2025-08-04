import { useCallback, useMemo, useRef } from 'react';
import { InputFieldView } from '../view/input-field-view';
import { FormField } from './form-field';
import { countries, TCountryCode } from 'countries-list';
import { RegularText } from '../text/text';
import { Popover } from 'tamagui';
import { AdaptivePopover } from '../popover/adaptive-popover';
import { useT } from '@symbiot-core-apps/i18n';
import { ToggleGroup, ToggleGroupValue } from './toggle-group';

const getCountryEmoji = (code: string) => {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map(
      (char) => 0x1f1e6 + char.charCodeAt(0) - 'A'.charCodeAt(0),
    ),
  );
};

export const CountryPicker = ({
  value,
  label,
  error,
  placeholder,
  disabled,
  onChange,
}: {
  value?: TCountryCode;
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (code: string) => void;
}) => {
  const { t } = useT();

  const popoverRef = useRef<Popover>(null);

  const data = useMemo(
    () =>
      (Object.keys(countries) as TCountryCode[])
        .map((code) => ({
          label: countries[code].native,
          description: countries[code].name,
          value: code,
          icon: (
            <RegularText fontSize={34}>{getCountryEmoji(code)}</RegularText>
          ),
        }))
        .sort((a, b) => (a.value === value ? -1 : b.value === value ? 1 : 0)),
    [value],
  );

  const onToggleGroupChange = useCallback(
    (code: ToggleGroupValue) => {
      onChange(code as string);
      popoverRef.current?.close();
    },
    [onChange],
  );

  return (
    <FormField label={label} error={error}>
      <AdaptivePopover
        ref={popoverRef}
        disabled={disabled}
        minWidth={200}
        maxHeight={400}
        sheetTitle={t('country')}
        triggerType="child"
        trigger={
          <InputFieldView disabled={disabled}>
            <RegularText
              flex={1}
              color={
                disabled ? '$disabled' : !value ? '$placeholderColor' : '$color'
              }
            >
              {value ? countries[value]?.native : placeholder}
            </RegularText>
          </InputFieldView>
        }
      >
        <ToggleGroup
          value={value}
          items={data}
          onChange={onToggleGroupChange}
        />
      </AdaptivePopover>
    </FormField>
  );
};
