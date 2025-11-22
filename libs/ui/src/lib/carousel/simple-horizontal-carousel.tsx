import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import React, {
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { View, XStack } from 'tamagui';
import { useWindowDimensions } from 'react-native';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { Chip } from '../chip/chip';

type StepProps = PropsWithChildren<{
  scrollX$: SharedValue<number>;
  index: number;
}>;

export type SimpleHorizontalCarouselRef = {
  next: () => void;
  prev: () => void;
  getActiveIndex: () => number;
};

export const SimpleHorizontalCarousel = forwardRef(
  (
    {
      id,
      initialIndex = 0,
      showCounter,
      children,
      onStartSwipe,
      onEndSwipe,
      onChangeActiveIndex,
    }: PropsWithChildren<{
      id: string;
      initialIndex?: number;
      showCounter?: boolean;
      onStartSwipe?: () => void;
      onEndSwipe?: () => void;
      onChangeActiveIndex?: (index: number) => void;
    }>,
    ref: ForwardedRef<SimpleHorizontalCarouselRef>,
  ) => {
    const { width } = useWindowDimensions();

    const [activeSlideIndex, setActiveSlideIndex] = useState(initialIndex);

    const scrollX$ = useSharedValue<number>(0);
    const panX$ = useSharedValue<number>(0);

    const childrenArr = React.Children.toArray(
      children,
    ) as ReactElement<StepProps>[];

    const moveSlides = useCallback(
      (nextIndex: number) => {
        if (nextIndex !== activeSlideIndex) {
          emitHaptic();
        }

        setActiveSlideIndex(nextIndex);
        onChangeActiveIndex && runOnJS(onChangeActiveIndex)(nextIndex);

        scrollX$.value = withTiming(
          -nextIndex * 100,
          {
            duration: 200,
          },
          () => {
            onEndSwipe && runOnJS(onEndSwipe)();
          },
        );
      },
      [activeSlideIndex, onChangeActiveIndex, onEndSwipe, scrollX$],
    );

    useEffect(() => {
      if (
        activeSlideIndex === undefined ||
        childrenArr.length <= activeSlideIndex
      ) {
        moveSlides(childrenArr.length - 1);
      }
    }, [activeSlideIndex, childrenArr.length, moveSlides]);

    useImperativeHandle(ref, () => ({
      next: () =>
        moveSlides(Math.min(activeSlideIndex + 1, childrenArr.length - 1)),
      prev: () => moveSlides(Math.max(activeSlideIndex - 1, 0)),
      getActiveIndex: () => activeSlideIndex,
    }));

    const panGesture = Gesture.Pan()
      .onStart((e) => {
        panX$.value = e.x;

        onStartSwipe && runOnJS(onStartSwipe)();
      })
      .onChange((e) => {
        if (e.numberOfPointers !== 1) {
          return;
        }

        panX$.value = e.x;
        scrollX$.value = Math.min(
          Math.max(
            scrollX$.value + (100 / width) * e.changeX,
            100 * -(childrenArr.length - 1),
          ),
          0,
        );
      })
      .onFinalize((e) => {
        const translateX = (100 / width) * -e.translationX;
        const minTranslate = 5;
        let nextIndex = activeSlideIndex;

        if (
          activeSlideIndex < childrenArr.length - 1 &&
          translateX > minTranslate
        ) {
          nextIndex = activeSlideIndex + 1;
        } else if (activeSlideIndex > 0 && translateX < -minTranslate) {
          nextIndex = activeSlideIndex - 1;
        }

        runOnJS(moveSlides)(nextIndex);
      })
      .minDistance(1)
      .runOnJS(true);

    return (
      <GestureHandlerRootView key={id}>
        <GestureDetector touchAction="pan-x" gesture={panGesture}>
          <XStack flex={1} position="relative" overflow="hidden">
            {childrenArr.map((child, i) => (
              <SlideElement key={i} index={i} scrollX$={scrollX$}>
                {child}
              </SlideElement>
            ))}

            {showCounter && (
              <Chip
                position="absolute"
                right="$2"
                bottom="$2"
                size="small"
                label={`${activeSlideIndex + 1}/${childrenArr.length}`}
              />
            )}
          </XStack>
        </GestureDetector>
      </GestureHandlerRootView>
    );
  },
);

const SlideElement = ({ scrollX$, index, children }: StepProps) => {
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
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          height: '100%',
          width: '100%',
          pointerEvents: 'none',
        },
      ]}
    >
      <View flex={1} position="relative">
        {children}
      </View>
    </Animated.View>
  );
};
