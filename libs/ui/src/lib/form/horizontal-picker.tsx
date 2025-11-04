import { ReactElement, useCallback } from 'react';
import { View } from 'tamagui';
import { AnimatedList } from '../list/animated-list';
import { RegularText } from '../text/text';
import { FormField } from './form-field';
import { Platform } from 'react-native';

export type HorizontalPickerItem = {
  value: unknown;
  label: string;
  icon: ReactElement;
};

export type HorizontalPickerValue = unknown | unknown[];
export type HorizontalPickerOnChange = (value: HorizontalPickerValue) => void;

export const HorizontalPicker = ({
  value,
  items,
  label,
  required,
  error,
  noValueItem,
  onChange,
}: {
  value: HorizontalPickerValue;
  items?: HorizontalPickerItem[];
  noValueItem?: HorizontalPickerItem;
  label?: string;
  required?: boolean;
  error?: string;
  onChange: HorizontalPickerOnChange;
}) => {
  const renderItem = useCallback(
    ({ item }: { item: HorizontalPickerItem }) => (
      <View
        flex={1}
        gap="$2"
        alignItems="center"
        justifyContent="center"
        padding="$2"
        paddingVertical="$4"
        paddingHorizontal="$2"
        borderRadius="$10"
        cursor="pointer"
        pressStyle={{ opacity: 0.8 }}
        maxWidth={100}
        backgroundColor={value === item.value ? '$background1' : undefined}
        onPress={() => onChange(item.value)}
      >
        {item.icon}

        <RegularText fontSize={12} numberOfLines={1}>
          {item.label}
        </RegularText>
      </View>
    ),
    [onChange, value],
  );

  return (
    <FormField
      label={label}
      required={required}
      error={error}
      flex={Platform.OS !== 'web' ? 1 : undefined}
    >
      <AnimatedList
        horizontal
        data={items}
        keyExtractor={(item) => String(item.value)}
        ListHeaderComponent={noValueItem && renderItem({ item: noValueItem })}
        renderItem={renderItem}
      />
    </FormField>
  );
};
