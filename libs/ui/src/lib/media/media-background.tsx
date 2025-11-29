import { Platform, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useVideoPlayer, VideoSource, VideoView } from 'expo-video';
import { Blur } from '../blur/blur';
import { useCallback, useEffect } from 'react';
import { useRestoreApp } from '@symbiot-core-apps/shared';
import { useFocusEffect } from 'expo-router';
import { View, ViewProps } from 'tamagui';

const AnimatedVideo = Animated.createAnimatedComponent(VideoView);

export const MediaBackground = ({
  blurhash,
  videoSource,
  playbackRate = 0.5,
  ...viewProps
}: ViewProps & {
  blurhash: string;
  playbackRate?: number;
  videoSource: VideoSource;
}) => {
  const player = useVideoPlayer(videoSource, (player) => {
    player.muted = true;
    player.loop = true;
    player.playbackRate = playbackRate;
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
    <>
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

          <Blur intensity={50} style={styles.BlurView} />
        </>
      )}

      <View flex={1} zIndex={20} {...viewProps} />
    </>
  );
};

const styles = StyleSheet.create({
  Media: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  BlurView: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    zIndex: 10,
  },
});
