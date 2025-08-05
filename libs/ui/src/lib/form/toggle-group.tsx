import { AnimatePresence, View, XStack } from 'tamagui';
import { ReactElement, useCallback, useMemo } from 'react';
import { RegularText } from '../text/text';
import { Icon } from '../icons';
import { InitView } from '../view/init-view';
import { emitHaptic } from '@symbiot-core-apps/shared';

export type ToggleGroupItem = {
  value: unknown;
  label: string;
  description?: string;
  icon?: ReactElement;
};

export type ToggleGroupValue = unknown | unknown[];

export const ToggleGroup = ({
  items,
  value,
  multiselect,
  allowEmpty,
  loading,
  disabled,
  error,
  onChange,
}: {
  value: ToggleGroupValue;
  items?: ToggleGroupItem[];
  multiselect?: boolean;
  allowEmpty?: boolean;
  loading?: boolean;
  disabled?: boolean;
  error?: string;
  onChange?: (value: ToggleGroupValue) => void;
}) => {
  return !items?.length ? (
    <InitView loading={loading} error={error} />
  ) : (
    <View gap="$4">
      {items?.map((item, index) => (
        <Item
          key={index}
          item={item}
          value={value}
          multiselect={multiselect}
          allowEmpty={allowEmpty}
          disabled={disabled}
          onChange={onChange}
        />
      ))}
    </View>
  );
};

const Item = ({
  item,
  value,
  disabled,
  multiselect,
  allowEmpty,
  onChange,
}: {
  item: ToggleGroupItem;
  value: ToggleGroupValue;
  multiselect?: boolean;
  allowEmpty?: boolean;
  disabled?: boolean;
  onChange?: (value: ToggleGroupValue) => void;
}) => {
  const selected = useMemo(
    () =>
      multiselect && Array.isArray(value)
        ? value.includes(item.value)
        : value === item.value,
    [item.value, multiselect, value],
  );

  const onPress = useCallback(() => {
    if (multiselect && Array.isArray(value)) {
      if (selected && value.length === 1 && !allowEmpty) {
        return;
      } else if (selected) {
        onChange?.(value.filter((itemValue) => itemValue !== item.value));
      }
    } else {
      if (!allowEmpty) {
        onChange?.(item.value);
      } else {
        onChange?.(item.value === value ? null : item.value);
      }
    }

    emitHaptic();
  }, [allowEmpty, item.value, multiselect, onChange, selected, value]);

  return (
    <XStack
      gap="$4"
      alignItems="center"
      disabled={disabled}
      cursor={!disabled && onChange ? 'pointer' : 'default'}
      disabledStyle={{ opacity: 0.8 }}
      pressStyle={!disabled && { opacity: 0.8 }}
      onPress={onPress}
    >
      {item.icon}

      <View flex={1} gap="$1" minHeight={24} justifyContent="center">
        <RegularText color={disabled ? '$disabled' : '$color'}>
          {item.label}
        </RegularText>

        {item.description && (
          <RegularText fontSize={12} color="$placeholderColor">
            {item.description}
          </RegularText>
        )}
      </View>

      <AnimatePresence>
        {selected && (
          <View
            animation="quick"
            enterStyle={{ scale: 0, opacity: 0 }}
            exitStyle={{ scale: 0, opacity: 0 }}
            scale={1}
            opacity={1}
          >
            <Icon
              name="Unread"
              color={disabled ? '$disabled' : '$checkboxColor'}
            />
          </View>
        )}
      </AnimatePresence>
    </XStack>
  );
};
