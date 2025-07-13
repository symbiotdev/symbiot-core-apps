import { View } from 'tamagui';
import { useVideoPlayer, VideoSource, VideoView } from 'expo-video';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useRestoreApp, useSystemScheme } from '@symbiot-core-apps/shared';
import { useEffect } from 'react';
import { Image, ImageSource } from 'expo-image';
import { H2, H4 } from '@symbiot-core-apps/ui';
import { SignInButtons } from './sign-in-buttons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';

const AnimatedVideo = Animated.createAnimatedComponent(VideoView);

export const Auth = ({
  title,
  subtitle,
  textColor,
  blurhash,
  videoSource,
  logoSource,
}: {
  title: string;
  subtitle: string;
  blurhash: string;
  textColor?: string;
  videoSource: VideoSource;
  logoSource: ImageSource;
}) => {
  const { bottom } = useSafeAreaInsets();
  const scheme = useSystemScheme();
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

  return (
    <View flex={1} position="relative">
      <Image
        style={styles.Media}
        placeholder={{ blurhash }}
        contentFit="cover"
      />

      <AnimatedVideo
        entering={Platform.OS !== 'web' ? FadeIn.duration(1000) : undefined}
        player={player}
        nativeControls={false}
        contentFit="cover"
        style={styles.Media}
      />

      <BlurView intensity={30} tint={scheme} style={styles.BlurView} />

      <View flex={1} zIndex={2}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ScrollView}
        >
          <View
            flex={1}
            alignItems="center"
            justifyContent="space-between"
            padding="$4"
            gap="$4"
            marginBottom={bottom}
          >
            <View />
            <View />

            <View gap="$2" alignItems="center">
              <Image source={logoSource} style={styles.Image} />

              <H2 textAlign="center" color={textColor}>
                {title}
              </H2>
              <H4 textAlign="center" color={textColor}>
                {subtitle}
              </H4>
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
  },
  BlurView: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: '100%',
  },
  Image: {
    width: 150,
    height: 150,
  },
});
