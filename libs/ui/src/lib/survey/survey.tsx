import React, {
  PropsWithChildren,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { View } from 'tamagui';

import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';
import { Platform, ScrollView } from 'react-native';
import { useScreenHeaderHeight } from '../navigation/header';
import {
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
} from '../view/page-view';
import { Progress } from '../loading/progress';
import { LoadingView } from '../view/loading-view';
import { H2 } from '../text/heading';
import { RegularText, SemiBoldText } from '../text/text';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Card } from '../card/card';
import { Icon } from '../icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formViewStyles } from '../view/form-view';
import { Button } from '../button/button';
import { useTranslation } from 'react-i18next';
import {
  emitHaptic,
  useKeyboardDismisser,
  useRendered,
} from '@symbiot-core-apps/shared';
import { ContainerView } from '../view/container-view';

type SurveyStepProps = PropsWithChildren<{
  title: string;
  subtitle: string;
  canGoNext: boolean;
  skippable?: boolean;
}>;

export const SurveyStep = (props: SurveyStepProps) => {
  const { rendered } = useRendered();

  return rendered && props.children;
};

export const Survey = ({
  children,
  initialIndex,
  loading,
  onFinish,
}: PropsWithChildren<{
  initialIndex?: number;
  loading?: boolean;
  ignoreNavigation?: boolean;
  onFinish: () => void;
}>) => {
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const headerHeight = useScreenHeaderHeight();
  const animatedValue$ = useSharedValue(0);

  const [selectedIndex, setSelectedIndex] = useState(initialIndex || 0);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const childrenArr = React.Children.toArray(
    children,
  ) as ReactElement<SurveyStepProps>[];
  const currentStep = selectedIndex !== null && childrenArr[selectedIndex];
  const previousStep = selectedIndex && childrenArr[selectedIndex - 1];
  const isLastStep = selectedIndex === childrenArr.length - 1;

  const currentSelectedIndexRef = useRef(selectedIndex);
  const scrollViewRef = useRef<ScrollView>(null);

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: 1 - Math.abs(animatedValue$.value),
      transform: [{ translateY: `${animatedValue$.value * 100}%` }],
    }),
    [],
  );

  const onNext = useKeyboardDismisser(
    useCallback(() => {
      if (!currentStep) return;

      if (isLastStep) {
        onFinish();
      } else {
        setSelectedIndex((current) => current + 1);
      }

      scrollViewRef.current?.scrollTo({
        y: 0,
      });
    }, [currentStep, isLastStep, onFinish]),
  );

  const onBackPress = useCallback(() => {
    emitHaptic();
    setSelectedIndex((prev) => prev - 1);
  }, []);

  useEffect(() => {
    if (
      selectedIndex !== null &&
      selectedIndex !== currentSelectedIndexRef.current
    ) {
      setScrollEnabled(false);

      animatedValue$.value =
        selectedIndex >= (currentSelectedIndexRef.current || 0) ? 1 : -1;
      animatedValue$.value = withDelay(
        50,
        withTiming(0, { duration: 250 }, () => {
          runOnJS(setScrollEnabled)(true);
        }),
      );

      currentSelectedIndexRef.current = selectedIndex;
    }
  }, [animatedValue$, selectedIndex]);

  return loading ? (
    <LoadingView />
  ) : (
    <ContainerView flex={1}>
      <Progress
        zIndex={1}
        top={headerHeight}
        height={2}
        left={0}
        position="absolute"
        value={(100 / childrenArr.length) * (selectedIndex + 1)}
      />

      <View flex={1}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          ref={scrollViewRef}
          scrollEnabled={scrollEnabled}
          bottomOffset={100}
          showsVerticalScrollIndicator={Platform.OS === 'web'}
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: headerHeight + defaultPageVerticalPadding,
            paddingHorizontal: defaultPageHorizontalPadding,
            gap: defaultPageVerticalPadding,
          }}
        >
          {!!previousStep && (
            <Card
              gap="$2"
              cursor="pointer"
              overflow="hidden"
              zIndex={1}
              pressStyle={{ opacity: 0.8 }}
              style={formViewStyles}
              onPress={onBackPress}
            >
              <Animated.View
                style={[animatedStyle, { gap: 6, flexDirection: 'row' }]}
              >
                <View flex={1} gap="$1">
                  <SemiBoldText numberOfLines={1}>
                    {previousStep.props.title}
                  </SemiBoldText>
                  <RegularText
                    numberOfLines={1}
                    color="$placeholderColor"
                    fontSize={12}
                  >
                    {previousStep.props.subtitle}
                  </RegularText>
                </View>

                <Icon name="ArrowToTopLeft" />
              </Animated.View>
            </Card>
          )}

          {!!currentStep && (
            <Animated.View
              style={[
                animatedStyle,
                formViewStyles,
                { gap: defaultPageVerticalPadding },
              ]}
            >
              <View
                gap="$2"
                paddingTop={
                  defaultPageVerticalPadding / (Platform.OS === 'web' ? 1 : 2)
                }
              >
                <H2>{currentStep.props.title}</H2>
                <RegularText>{currentStep.props.subtitle}</RegularText>
              </View>

              {currentStep}
            </Animated.View>
          )}
        </KeyboardAwareScrollView>

        {!!currentStep && (
          <Animated.View style={[animatedStyle]}>
            <KeyboardStickyView
              offset={{ opened: bottom }}
              style={[
                formViewStyles,
                {
                  gap: 0,
                  paddingHorizontal: defaultPageHorizontalPadding,
                  paddingTop: 4,
                  paddingBottom: bottom + defaultPageVerticalPadding
                },
              ]}
            >
              <Button
                disabled={!currentStep.props.canGoNext}
                label={t(isLastStep ? 'shared.finish' : 'shared.next')}
                onPress={onNext}
              />

              {currentStep.props.skippable && (
                <Button
                  type="clear"
                  label={t('shared.skip')}
                  onPress={onNext}
                />
              )}
            </KeyboardStickyView>
          </Animated.View>
        )}
      </View>
    </ContainerView>
  );
};
