import {
  Button,
  Error,
  H2,
  PageView,
  RegularText,
} from '@symbiot-core-apps/ui';
import { PropsWithChildren, ReactElement } from 'react';
import { View } from 'tamagui';

export const AuthFormView = ({
  children,
  title,
  subtitle,
  buttonLabel,
  error,
  loading,
  disabled,
  logo,
  externalLink,
  onButtonPress,
}: PropsWithChildren<{
  title: string;
  subtitle: string;
  buttonLabel: string;
  error?: string;
  loading?: boolean;
  disabled?: boolean;
  logo: ReactElement;
  externalLink?: ReactElement;
  onButtonPress: () => Promise<void>;
}>) => {
  return (
    <PageView scrollable withKeyboard lazy={false}>
      <View
        flex={1}
        gap="$3"
        justifyContent="center"
        maxWidth={480}
        width="100%"
        marginHorizontal="auto"
      >
        <View gap="$5" marginVertical="$5" alignItems="center">
          {logo}

          <View gap="$1">
            <H2 textAlign="center">{title}</H2>
            <RegularText textAlign="center">{subtitle}</RegularText>
          </View>
        </View>

        {children}

        {!!error && <Error textAlign="center">{error}</Error>}

        <Button
          marginTop="$5"
          alignSelf="center"
          disabled={loading || disabled}
          loading={loading}
          label={buttonLabel}
          onPress={onButtonPress}
        />

        {externalLink}
      </View>
    </PageView>
  );
};
