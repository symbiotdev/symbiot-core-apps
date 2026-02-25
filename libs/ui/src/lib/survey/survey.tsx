import React, {
  PropsWithChildren,
  ReactElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { View } from 'tamagui';

import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewRef,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';
import { H2 } from '../text/heading';
import { RegularText, SemiBoldText } from '../text/text';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { compactViewStyles } from '../view/compact-view';
import { Button } from '../button/button';
import {
  ConfirmAlert,
  emitHaptic,
  isWeb,
  useI18n,
  useKeyboardDismisser,
  useRendered,
} from '@symbiot-core-apps/shared';
import { router, useNavigation } from 'expo-router';
import { Pressable } from 'react-native';
import { EventArg, NavigationAction } from '@react-navigation/native';
import {
  Container,
  GlassView,
  Icon,
  LoadingView,
  PAGE_STYLE,
  useHeaderHeight,
} from '@symbiot-core-apps/ui2';
import { scheduleOnRN } from 'react-native-worklets';

type SurveyStepProps = PropsWithChildren<{
  title: string;
  subtitle: string;
  canGoNext: boolean;
  skippable?: boolean;
}>;

export type onSurveyFinish = {
  replaceUrl: string;
  postCallback?: () => Promise<void>;
};

const headerTextPadding = isWeb
  ? PAGE_STYLE.paddingVertical
  : PAGE_STYLE.paddingVertical / 2;

export const SurveyStep = (props: SurveyStepProps) => {
  const { rendered } = useRendered();

  return rendered && props.children;
};

export const Survey = ({
  loading,
  children,
  initialIndex,
  leaveAlertParams,
  onFinish,
}: PropsWithChildren<{
  loading: boolean;
  initialIndex?: number;
  leaveAlertParams: {
    title: string;
    subtitle?: string;
  };
  onFinish: () => Promise<onSurveyFinish>;
}>) => {
  const { t } = useI18n();
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
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
  const scrollViewRef = useRef<KeyboardAwareScrollViewRef>(null);
  const finishedRef = useRef(false);

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: 1 - Math.abs(animatedValue$.value),
      transform: [{ translateY: `${animatedValue$.value * 100}%` }],
    }),
    [],
  );

  const onNext = useKeyboardDismisser(
    useCallback(async () => {
      if (!currentStep) return;

      if (isLastStep) {
        try {
          const { replaceUrl, postCallback } = await onFinish();

          finishedRef.current = true;

          router.replace(replaceUrl);

          await postCallback?.();
        } catch {
          finishedRef.current = false;
        }
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

  useLayoutEffect(() => {
    const onLeave = (
      e: EventArg<'beforeRemove', true, { action: NavigationAction }>,
    ) => {
      if (finishedRef.current) return;

      e.preventDefault();

      ConfirmAlert({
        title: leaveAlertParams.title,
        message: leaveAlertParams.subtitle,
        onAgree: () => navigation.dispatch(e.data.action),
      });
    };

    navigation.addListener('beforeRemove', onLeave);
    navigation.setOptions({
      gestureEnabled: false,
      headerShown: !loading && !finishedRef.current,
      headerRight: () => (
        <View
          width={40}
          height={40}
          justifyContent="center"
          alignItems="center"
        >
          <RegularText textAlign="center">
            {selectedIndex + 1}/{childrenArr.length}
          </RegularText>
        </View>
      ),
    });

    return () => {
      navigation.removeListener('beforeRemove', onLeave);
    };
  }, [
    loading,
    navigation,
    selectedIndex,
    leaveAlertParams,
    childrenArr.length,
  ]);

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
          scheduleOnRN(setScrollEnabled, true);
        }),
      );

      currentSelectedIndexRef.current = selectedIndex;
    }
  }, [animatedValue$, selectedIndex]);

  return loading ? (
    <LoadingView />
  ) : (
    <Container style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        ref={scrollViewRef}
        scrollEnabled={scrollEnabled}
        bottomOffset={100}
        showsVerticalScrollIndicator={isWeb}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: headerHeight + PAGE_STYLE.paddingVertical,
          paddingHorizontal: PAGE_STYLE.paddingHorizontal,
          gap: PAGE_STYLE.paddingVertical,
        }}
      >
        {!!previousStep && (
          <Pressable onPress={onBackPress}>
            <GlassView
              interactive
              style={{ ...compactViewStyles, padding: 15, borderRadius: 20 }}
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
                    color="$placeholder"
                    fontSize={12}
                  >
                    {previousStep.props.subtitle}
                  </RegularText>
                </View>

                <Icon name="ArrowToTopLeft" />
              </Animated.View>
            </GlassView>
          </Pressable>
        )}

        {!!currentStep && (
          <Animated.View
            style={[
              animatedStyle,
              compactViewStyles,
              { gap: PAGE_STYLE.paddingVertical },
            ]}
          >
            <View gap="$2" paddingVertical={headerTextPadding}>
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
              compactViewStyles,
              {
                gap: 0,
                paddingHorizontal: PAGE_STYLE.paddingHorizontal,
                paddingTop: 4,
                paddingBottom: bottom + PAGE_STYLE.paddingVertical,
              },
            ]}
          >
            <Button
              disabled={!currentStep.props.canGoNext}
              label={t(isLastStep ? 'shared.finish' : 'shared.next')}
              onPress={onNext}
            />

            {currentStep.props.skippable && (
              <Button type="clear" label={t('shared.skip')} onPress={onNext} />
            )}
          </KeyboardStickyView>
        </Animated.View>
      )}
    </Container>
  );
};
