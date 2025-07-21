import { View } from 'tamagui';
import { useVideoPlayer, VideoSource, VideoView } from 'expo-video';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { useRestoreApp } from '@symbiot-core-apps/shared';
import { ReactElement, useCallback, useEffect } from 'react';
import { Image } from 'expo-image';
import { Blur, H2, H4 } from '@symbiot-core-apps/ui';
import { SignInButtons } from './sign-in-buttons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';

const AnimatedVideo = Animated.createAnimatedComponent(VideoView);

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
  const player = useVideoPlayer(videoSource, (player) => {
    player.muted = true;
    player.loop = true;
    player.playbackRate = 0.5;
  });

  useEffect(() => {
    player.play();
  }, [player]);

  useRestoreApp(() => {
    player.play();
  });

  useFocusEffect(
    useCallback(() => {
      player.play();
    }, [player]),
  );

  return (
    <View flex={1} position="relative">
      <Image
        style={styles.Media}
        placeholder={{ blurhash }}
        contentFit="cover"
      />

      {Platform.OS !== 'android' && (
        <>
          <AnimatedVideo
            entering={Platform.OS !== 'web' ? FadeIn.duration(1000) : undefined}
            player={player}
            nativeControls={false}
            contentFit="cover"
            style={styles.Media}
          />

          <Blur style={styles.BlurView} />
        </>
      )}

      <View flex={1} zIndex={20}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ScrollView}
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

              <View gap="$2" maxWidth={300}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ScrollView: {
    minHeight: '100%',
  },
  Media: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  BlurView: {
    position: 'absolute',
    zIndex: 10,
    width: '100%',
    height: '100%',
  },
});
