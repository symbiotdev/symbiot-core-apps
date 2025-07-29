import { View, XStack } from 'tamagui';
import { ReactElement, useCallback, useMemo } from 'react';
import { RegularText } from '../text/text';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { Icon } from '../icons';

export type ToggleGroupItem = {
  label: string;
  value: unknown;
  icon?: ReactElement;
};

export const ToggleGroup = ({
  items,
  value,
  multiselect,
  allowEmpty,
  disabled,
  onChange,
}: {
  items: ToggleGroupItem[];
  value: unknown[];
  multiselect?: boolean;
  allowEmpty?: boolean;
  disabled?: boolean;
  onChange?: (value: unknown[]) => void;
}) => {
  return (
    <View gap="$4">
      {items.map((item, index) => (
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
  value: unknown[];
  multiselect?: boolean;
  allowEmpty?: boolean;
  disabled?: boolean;
  onChange?: (value: unknown[]) => void;
}) => {
  const selected = useMemo(
    () => value.includes(item.value),
    [item.value, value],
  );

  const onPress = useCallback(() => {
    if (selected && value.length === 1 && !allowEmpty) {
      return;
    } else if (selected) {
      onChange?.(value.filter((itemValue) => itemValue !== item.value));
    } else {
      if (multiselect) {
        onChange?.([...value, item.value]);
      } else {
        onChange?.([item.value]);
      }
    }

    void impactAsync(ImpactFeedbackStyle.Light);
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

      <RegularText flex={1} color={disabled ? '$disabled' : '$color'}>
        {item.label}
      </RegularText>

      {selected && (
        <Icon name="Unread" color={disabled ? '$disabled' : '$checkboxColor'} />
      )}
    </XStack>
  );
};
