import React, { memo, useCallback, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme, View, XStack } from 'tamagui';
import { Button, H2, RegularText } from '@symbiot-core-apps/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image, ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { selectionAsync } from 'expo-haptics';
import { useOnboardingState } from '@symbiot-core-apps/state';
import { useT } from '@symbiot-core-apps/i18n';

export type OnboardingSlide = {
  id: string;
  title: string;
  subtitle: string;
  image: ImageSource;
};

export const Onboarding = memo(({ slides }: { slides: OnboardingSlide[] }) => {
  const { bottom, left, right } = useSafeAreaInsets();
  const { t } = useT();
  const { width } = useWindowDimensions();
  const { finish } = useOnboardingState();

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const scrollX$ = useSharedValue<number>(0);
  const panX$ = useSharedValue<number>(0);

  const moveSlides = useCallback(
    (nextIndex: number) => {
      if (nextIndex !== activeSlideIndex) {
        void selectionAsync();
      }

      setActiveSlideIndex(nextIndex);

      scrollX$.value = withTiming(-nextIndex * 100, {
        duration: 200,
      });
    },
    [activeSlideIndex],
  );

  const onNextPress = useCallback(() => {
    if (activeSlideIndex < slides.length - 1) {
      moveSlides(activeSlideIndex + 1);
    } else {
      finish();
    }
  }, [activeSlideIndex, moveSlides, slides.length, finish]);

  const panGesture = Gesture.Pan()
    .onStart((e) => (panX$.value = e.x))
    .onChange((e) => {
      if (e.numberOfPointers !== 1) {
        return;
      }

      panX$.value = e.x;
      scrollX$.value = Math.min(
        Math.max(
          scrollX$.value + (100 / width) * e.changeX,
          100 * -(slides.length - 1),
        ),
        0,
      );
    })
    .onFinalize((e) => {
      const translateX = (100 / width) * -e.translationX;
      const minTranslate = 5;
      let nextIndex = activeSlideIndex;

      if (activeSlideIndex < slides.length - 1 && translateX > minTranslate) {
        nextIndex = activeSlideIndex + 1;
      } else if (activeSlideIndex > 0 && translateX < -minTranslate) {
        nextIndex = activeSlideIndex - 1;
      }

      runOnJS(moveSlides)(nextIndex);
    })
    .minDistance(1)
    .runOnJS(true);

  return (
    <View flex={1} paddingBottom={bottom} backgroundColor="$background1">
      <GestureHandlerRootView key="symbiot-onboarding">
        <GestureDetector touchAction="pan-x" gesture={panGesture}>
          <XStack flex={1} position="relative" overflow="hidden">
            {slides.map((slide, index) => (
              <Slide
                scrollX$={scrollX$}
                key={slide.id}
                slide={slide}
                index={index}
              />
            ))}
          </XStack>
        </GestureDetector>
      </GestureHandlerRootView>

      <View padding="$4" gap="$5" marginLeft={left} marginRight={right}>
        <XStack width="100%" gap="$2">
          {slides.map((slide, index) => (
            <View
              key={slide.id}
              borderRadius="$4"
              width="$8"
              height="$1"
              backgroundColor={
                index <= activeSlideIndex ? '$color' : '$background'
              }
            />
          ))}
        </XStack>

        <Button maxWidth={400} label={t('next')} onPress={onNextPress} />
      </View>
    </View>
  );
});

const Slide = memo(
  ({
    scrollX$,
    slide,
    index,
  }: {
    scrollX$: SharedValue<number>;
    slide: OnboardingSlide;
    index: number;
  }) => {
    const { left, right } = useSafeAreaInsets();
    const theme = useTheme();

    const animatedStyle = useAnimatedStyle(
      () => ({
        transform: [
          {
            translateX: `${index * 100 + scrollX$.value}%`,
          },
        ],
      }),
      [],
    );

    return (
      <Animated.View style={[styles.Slide, animatedStyle]}>
        <View flex={1} position="relative">
          <Image source={slide.image} style={styles.Image} />
          <LinearGradient
            colors={['rgba(0,0,0,0)', theme.background1?.val]}
            style={styles.LinearGradient}
          />
        </View>

        <View
          paddingTop="$2"
          gap="$1"
          paddingHorizontal="$4"
          marginTop="auto"
          marginLeft={left}
          marginRight={right}
        >
          <RegularText>{slide.title}</RegularText>
          <H2>{slide.subtitle}</H2>
        </View>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  Slide: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    pointerEvents: 'none',
  },
  Image: {
    height: '100%',
  },
  LinearGradient: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    width: '100%',
    height: 300,
    zIndex: 1,
  },
});
