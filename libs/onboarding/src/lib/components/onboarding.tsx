import React, { memo, useCallback, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme, View, XStack } from 'tamagui';
import { Button, H2, H4 } from '@symbiot-core-apps/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image, ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
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
import { impactAsync } from 'expo-haptics';
import { useOnboardingState } from '@symbiot-core-apps/store';

export type OnboardingSlide = {
  id: string;
  title: string;
  subtitle: string;
  image: ImageSource;
};

export const Onboarding = memo(({ slides }: { slides: OnboardingSlide[] }) => {
  const { bottom, left, right } = useSafeAreaInsets();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { finish } = useOnboardingState();

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const scrollX$ = useSharedValue<number>(0);
  const panX$ = useSharedValue<number>(0);

  const moveSlides = useCallback(
    (nextIndex: number) => {
      if (nextIndex !== activeSlideIndex) {
        void impactAsync();
      }

      setActiveSlideIndex(nextIndex);

      scrollX$.value = withTiming(-nextIndex * 100, {
        duration: 200,
      });
    },
    [activeSlideIndex]
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
          100 * -(slides.length - 1)
        ),
        0
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
    <View flex={1} paddingBottom={bottom}>
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

      <XStack
        width="100%"
        padding="$4"
        gap="$2"
        marginLeft={left}
        marginRight={right}
      >
        {slides.map((slide, index) => (
          <View
            key={slide.id}
            borderRadius="$4"
            width="$3"
            height="$0.5"
            backgroundColor={index <= activeSlideIndex ? '$color' : '$color8'}
          />
        ))}
      </XStack>

      <View padding="$4" marginLeft={left} marginRight={right}>
        <Button label={t('shared.next')} onPress={onNextPress} />
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
      []
    );

    return (
      <Animated.View style={[styles.Slide, animatedStyle]}>
        <View flex={1} position="relative">
          <Image source={slide.image} style={styles.Image} />
          <LinearGradient
            colors={['rgba(0,0,0,0)', theme.color1?.val]}
            style={styles.LinearGradient}
          />
        </View>

        <View
          maxWidth={768}
          width="100%"
          paddingTop="$4"
          paddingHorizontal="$4"
          paddingBottom="$2"
          gap="$2"
          marginTop="auto"
          marginLeft={left}
          marginRight={right}
        >
          <H4>{slide.title}</H4>
          <H2>{slide.subtitle}</H2>
        </View>
      </Animated.View>
    );
  }
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
