import React, { useCallback, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import {
  CodeField,
  Cursor,
  RenderCellOptions,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { View } from 'tamagui';
import { Error } from '../text/custom';
import { RegularText } from '../text/text';

export const InputCode = ({
  cellCount,
  error,
  disabled,
  onChange,
}: {
  cellCount: number;
  onChange: (code: string) => void;
  error?: string;
  disabled?: boolean;
}) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value: value, cellCount });
  const [codeFieldProps, getCellOnLayout] = useClearByFocusCell({
    value,
    setValue,
  });

  const onBlur = useCallback(() => onChange(value), [value, onChange]);

  const renderCell = useCallback(
    ({ index, symbol, isFocused }: RenderCellOptions) => (
      <View
        key={index}
        onLayout={getCellOnLayout(index)}
        flex={1}
        maxWidth={50}
        height={50}
        borderRadius="$6"
        backgroundColor="$background1"
        marginVertical={6}
      >
        <RegularText textAlign="center" lineHeight={50} fontSize={18}>
          {symbol || (isFocused ? <Cursor /> : null)}
        </RegularText>
      </View>
    ),
    [getCellOnLayout]
  );

  return (
    <View gap="$3">
      <CodeField
        ref={ref}
        {...codeFieldProps}
        value={value}
        rootStyle={styles.CodeFieldRoot}
        readOnly={disabled}
        cellCount={cellCount}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
        renderCell={renderCell}
        onChangeText={setValue}
        onBlur={onBlur}
      />

      {!!error && <Error textAlign="center">{error}</Error>}
    </View>
  );
};

const styles = StyleSheet.create({
  CodeFieldRoot: {
    justifyContent: 'center',
    gap: 12,
  },
});
