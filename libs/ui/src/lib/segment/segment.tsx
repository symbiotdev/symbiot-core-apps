import { memo } from 'react';
import { View, XStack, XStackProps } from 'tamagui';
import { MediumText, SemiBoldText } from '../text/text';
import { emitHaptic } from '@symbiot-core-apps/shared';

export type SegmentItem = {
  placeholder?: string;
  label: string;
  value: string;
};

export const Segment = memo(
  ({
    value,
    items,
    disabled,
    onChange,
    ...xStackProps
  }: XStackProps & {
    value: string;
    items: SegmentItem[];
    onChange: (value: string) => void;
  }) => {
    return (
      <XStack
        gap="$1"
        width="100%"
        borderRadius="$10"
        padding="$1"
        backgroundColor="$background"
        disabled={disabled}
        disabledStyle={{ opacity: 0.8 }}
        {...xStackProps}
      >
        {items.map((item) => (
          <View
            key={item.value}
            flex={1}
            padding="$2"
            borderRadius="$8"
            gap="$1"
            alignItems="center"
            cursor={disabled ? 'auto' : 'pointer'}
            disabled={disabled}
            backgroundColor={value === item.value ? '$color' : 'transparent'}
            onPress={() => {
              emitHaptic();
              onChange(item.value);
            }}
          >
            {!!item.placeholder && (
              <MediumText color="$placeholderColor">
                {item.placeholder}
              </MediumText>
            )}
            <SemiBoldText
              color={value === item.value ? '$background' : '$color'}
            >
              {item.label}
            </SemiBoldText>
          </View>
        ))}
      </XStack>
    );
  },
);
