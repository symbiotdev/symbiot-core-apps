import {
  Button,
  Error,
  H2,
  PageView,
  RegularText,
} from '@symbiot-core-apps/ui';
import { PropsWithChildren } from 'react';
import { View } from 'tamagui';
import { Image, ImageSource } from 'expo-image';
import { StyleSheet } from 'react-native';

export const AuthFormView = ({
  children,
  title,
  subtitle,
  buttonLabel,
  logoSource,
  error,
  loading,
  disabled,
  onButtonPress,
}: PropsWithChildren<{
  title: string;
  subtitle: string;
  buttonLabel: string;
  logoSource: ImageSource;
  error?: string;
  loading?: boolean;
  disabled?: boolean;
  onButtonPress: () => Promise<void>;
}>) => {
  return (
    <PageView scrollable withKeyboard>
      <View
        flex={1}
        gap="$3"
        justifyContent="center"
        maxWidth={480}
        width="100%"
        marginHorizontal="auto"
      >
        <View gap="$2" marginVertical="$4" alignItems="center">
          <Image source={logoSource} style={styles.Image} />

          <H2 textAlign="center">{title}</H2>
          <RegularText textAlign="center">{subtitle}</RegularText>
        </View>

        {children}

        {!!error && <Error textAlign="center">{error}</Error>}

        <Button
          marginTop="$4"
          alignSelf="center"
          disabled={loading || disabled}
          loading={loading}
          label={buttonLabel}
          onPress={onButtonPress}
        />
      </View>
    </PageView>
  );
};

const styles = StyleSheet.create({
  Image: {
    width: 100,
    height: 100,
  },
});
