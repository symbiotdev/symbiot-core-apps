import { View } from 'tamagui';
import { RegularText } from '@symbiot-core-apps/ui';
import { FormField } from '../wrapper/form-field';
import { InputHeight } from '../wrapper/input-field-view';
import { ToggleList, ToggleListProps } from '@symbiot-core-apps/ui2';

export const HorizontalMultiToggle = ({
  label,
  error,
  required,
  max,
  ...toggleListProps
}: Omit<ToggleListProps, 'multiselect' | 'horizontal'> & {
  label?: string;
  error?: string;
  required?: boolean;
  max?: number;
}) => {
  return (
    <FormField label={label} error={error} required={required}>
      <ToggleList
        horizontal
        multiselect
        {...toggleListProps}
        renderOption={({ option, selected }) => (
          <View
            backgroundColor={selected ? '$highlighted' : '$background1'}
            padding="$3"
            justifyContent="center"
            alignItems="center"
            borderRadius={InputHeight}
            minWidth={InputHeight}
            minHeight={InputHeight}
            marginRight={5}
          >
            <RegularText textAlign="center" fontSize={12}>
              {option.label}
            </RegularText>
          </View>
        )}
      />
    </FormField>
  );
};
