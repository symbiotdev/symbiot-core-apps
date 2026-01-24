import React, { memo, useCallback, useRef, useState } from 'react';
import { useTheme, View, XStack } from 'tamagui';
import {
  Button,
  H2,
  RegularText,
  SimpleHorizontalCarousel,
  SimpleHorizontalCarouselRef,
} from '@symbiot-core-apps/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image, ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useOnboardingState } from '@symbiot-core-apps/state';
import { useI18n } from '@symbiot-core-apps/shared';

export type OnboardingSlide = {
  id: string;
  title: string;
  subtitle: string;
  image: ImageSource;
};

export const Onboarding = memo(({ slides }: { slides: OnboardingSlide[] }) => {
  const { t } = useI18n();
  const theme = useTheme();
  const { finish } = useOnboardingState();
  const { bottom, left, right } = useSafeAreaInsets();

  const ref = useRef<SimpleHorizontalCarouselRef>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const onNextPress = useCallback(() => {
    if (activeIndex < slides.length - 1) {
      ref.current?.next();
    } else {
      finish();
    }
  }, [activeIndex, slides.length, finish]);

  return (
    <View flex={1} paddingBottom={bottom} backgroundColor="$background1">
      <SimpleHorizontalCarousel
        id="ssymbiot-onboarding"
        ref={ref}
        initialIndex={activeIndex}
        onChangeActiveIndex={setActiveIndex}
      >
        {slides.map((slide, index) => (
          <View key={index} flex={1}>
            <View flex={1} position="relative">
              <Image source={slide.image} style={{ height: '100%' }} />
              <LinearGradient
                colors={['rgba(0,0,0,0)', theme.background1?.val]}
                style={{
                  position: 'absolute',
                  bottom: -1,
                  left: 0,
                  width: '100%',
                  height: 300,
                  zIndex: 1,
                }}
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
          </View>
        ))}
      </SimpleHorizontalCarousel>

      <View padding="$4" gap="$5" marginLeft={left} marginRight={right}>
        <XStack width="100%" gap="$2">
          {slides.map((slide, index) => (
            <View
              key={slide.id}
              borderRadius="$4"
              width="$8"
              height="$1"
              backgroundColor={index <= activeIndex ? '$color' : '$background'}
            />
          ))}
        </XStack>

        <Button maxWidth={400} label={t('shared.next')} onPress={onNextPress} />
      </View>
    </View>
  );
});
