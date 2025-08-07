import { useCallback, useMemo, useRef } from 'react';
import { InputFieldView } from '../view/input-field-view';
import { FormField } from './form-field';
import { RegularText } from '../text/text';
import {
  AdaptivePopover,
  AdaptivePopoverRef,
} from '../popover/adaptive-popover';
import { useT } from '@symbiot-core-apps/i18n';
import { currencySymbol } from '@symbiot-core-apps/shared';
import { ToggleGroup, ToggleGroupValue } from './toggle-group';

export const CurrencyPicker = ({
  value,
  label,
  error,
  placeholder,
  disabled,
  onChange,
}: {
  value?: string;
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (code: string) => void;
}) => {
  const { t } = useT();

  const popoverRef = useRef<AdaptivePopoverRef>(null);

  const data = useMemo(
    () =>
      Array.from([
        ...new Set(
          Object.keys(currencySymbol).sort((a, b) =>
            a === value ? -1 : b === value ? 1 : 0,
          ),
        ),
      ]).map((currency) => ({
        label: `${currency} · ${currencySymbol[currency]}`,
        value: currency,
      })),
    [value],
  );

  const onToggleGroupChange = useCallback(
    (value: ToggleGroupValue) => {
      onChange(value as string);
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
        sheetTitle={t('currency')}
        triggerType="child"
        trigger={
          <InputFieldView disabled={disabled}>
            <RegularText
              flex={1}
              color={
                disabled ? '$disabled' : !value ? '$placeholderColor' : '$color'
              }
            >
              {value ? `${value} · ${currencySymbol[value]}` : placeholder}
            </RegularText>
          </InputFieldView>
        }
      >
        <ToggleGroup
          ignoreHaptic
          value={value}
          items={data}
          onChange={onToggleGroupChange}
        />
      </AdaptivePopover>
    </FormField>
  );
};
