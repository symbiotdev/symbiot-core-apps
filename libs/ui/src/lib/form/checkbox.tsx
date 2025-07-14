import { AnimatePresence, View, XStack } from 'tamagui';
import { ReactElement, useCallback } from 'react';
import { Icon } from '../icons/icon';
import { Error } from '../text/custom';
import { RegularText } from '../text/text';

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
  const toggle = useCallback(
    () => !disabled && onChange(!value),
    [disabled, onChange, value]
  );

  return (
    <View gap="$2" flex={1}>
      <XStack
        gap="$3"
        alignItems="center"
        cursor={!disabled ? 'pointer' : 'auto'}
        onPress={toggle}
      >
        <View
          disabled={disabled}
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$3"
          backgroundColor="$background"
          justifyContent="center"
          alignItems="center"
          width={24}
          height={24}
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
                <Icon.Dynamic
                  name="check"
                  type="Feather"
                  size={20}
                  color={disabled ? '$disabled' : undefined}
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
