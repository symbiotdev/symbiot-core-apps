import { AnimatePresence, View, XStack } from 'tamagui';
import { ReactElement, useCallback } from 'react';
import { emitHaptic } from '@symbiot-core-apps/shared';
import {
  defaultIconSize,
  Error,
  Icon,
  RegularText,
} from '@symbiot-core-apps/ui';

export const Checkbox = ({
  value,
  label,
  error,
  disabled,
  onChange,
}: {
  value: boolean;
  label?: string | ReactElement;
  error?: string;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) => {
  const toggle = useCallback(() => {
    if (disabled) {
      return;
    }

    onChange(!value);
    emitHaptic();
  }, [disabled, onChange, value]);

  return (
    <View gap="$2">
      <XStack
        gap="$3"
        alignItems="center"
        cursor={!disabled ? 'pointer' : 'auto'}
        onPress={toggle}
      >
        <View
          disabled={disabled}
          borderWidth={1}
          borderColor="$checkboxColor"
          borderRadius="$3"
          justifyContent="center"
          alignItems="center"
          width={defaultIconSize}
          height={defaultIconSize}
        >
          <AnimatePresence>
            {value && (
              <View
                opacity={1}
                scale={1}
                enterStyle={{ scale: 0, opacity: 0 }}
                exitStyle={{ scale: 0, opacity: 0 }}
                animation="quick"
              >
                <Icon
                  name="Unread"
                  size={20}
                  color={disabled ? '$disabled' : '$checkboxColor'}
                />
              </View>
            )}
          </AnimatePresence>
        </View>

        {!!label && <RegularText flex={1}>{label}</RegularText>}
      </XStack>

      {!!error && <Error>{error}</Error>}
    </View>
  );
};
