import { Picker as RNPicker } from '@react-native-picker/picker';
import { useCallback, useState } from 'react';
import { useTheme, View, ViewProps } from 'tamagui';

export const Picker = ({
  value,
  options,
  onChange,
  ...viewProps
}: Omit<ViewProps, 'onMoveShouldSetResponder'> & {
  value?: unknown;
  options: { label: string; value: unknown }[];
  onChange?: (value: string) => void;
}) => {
  const theme = useTheme();
  const [selectedValue, setSelectedValue] = useState(value);

  const onValueChange = useCallback(
    (newValue: string) => {
      setSelectedValue(newValue);
      onChange?.(newValue);
    },
    [onChange],
  );

  return (
    <View
      onMoveShouldSetResponder={(e) => {
        e.stopPropagation();

        return false;
      }}
      {...viewProps}
    >
      <RNPicker
        selectedValue={selectedValue as string}
        onValueChange={onValueChange}
        itemStyle={{ fontFamily: 'BodyMedium', color: theme.color?.val }}
      >
        {options.map((option, index) => (
          <RNPicker.Item
            key={index}
            label={option.label}
            value={option.value}
          />
        ))}
      </RNPicker>
    </View>
  );
};
