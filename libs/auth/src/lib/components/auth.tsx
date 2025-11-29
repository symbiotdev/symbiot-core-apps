import { View } from 'tamagui';
import { VideoSource } from 'expo-video';
import { Platform, ScrollView } from 'react-native';
import { ReactElement } from 'react';
import { H2, H4, MediaBackground } from '@symbiot-core-apps/ui';
import { SignInButtons } from './sign-in-buttons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const Auth = ({
  title,
  subtitle,
  textColor,
  blurhash,
  videoSource,
  logo,
}: {
  title: string;
  subtitle: string;
  blurhash: string;
  textColor?: string;
  videoSource: VideoSource;
  logo: ReactElement;
}) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View flex={1} position="relative">
      <MediaBackground blurhash={blurhash} videoSource={videoSource}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View
            flex={1}
            alignItems="center"
            justifyContent={Platform.OS === 'web' ? 'center' : 'space-between'}
            padding="$4"
            gap="$10"
            marginBottom={bottom}
          >
            <View />
            <View />

            <View gap="$5" alignItems="center">
              {logo}

              <View gap="$2" maxWidth={350}>
                <H2 textAlign="center" color={textColor}>
                  {title}
                </H2>
                <H4 textAlign="center" color={textColor}>
                  {subtitle}
                </H4>
              </View>
            </View>

            <SignInButtons />
          </View>
        </ScrollView>
      </MediaBackground>
    </View>
  );
};
