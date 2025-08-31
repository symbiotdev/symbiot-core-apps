import { useCallback, useEffect, useRef, useState } from 'react';
import { SurveyStep } from '../types/survey-step';
import { View } from 'tamagui';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { LayoutChangeEvent } from 'react-native';
import { SurveyStepForm } from './survey-step-form';
import { useKeyboardDismisser } from '@symbiot-core-apps/shared';

export function SurveyStepsFlow<V>({
  value,
  currentStepId,
  steps,
  onChange,
  onSkip,
}: {
  value: V;
  currentStepId: string;
  steps: SurveyStep<V>[];
  onChange: (value: V) => void;
  onSkip: () => void;
}) {
  const carouselRef = useRef<ICarouselInstance>(null);

  const [width, setWidth] = useState(0);

  const onStepFormChange = useKeyboardDismisser(
    useCallback(onChange, [onChange]),
  );

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width),
    [],
  );

  useEffect(() => {
    const nextIndex = steps.findIndex(({ id }) => id === currentStepId);

    if (width && carouselRef.current) {
      carouselRef.current.scrollTo({
        index: nextIndex,
        animated: nextIndex !== carouselRef.current.getCurrentIndex(),
      });
    }
  }, [width, currentStepId, steps]);

  return (
    <View
      flex={1}
      animation="medium"
      opacity={1}
      enterStyle={{ opacity: 0 }}
      exitStyle={{ opacity: 0 }}
      id="survey-steps-flow"
      dataSet={{ kind: 'basic-layouts', name: 'normal' }}
      onLayout={onLayout}
    >
      {!!width && (
        <Carousel
          enabled={false}
          loop={false}
          ref={carouselRef}
          width={width}
          data={steps}
          modeConfig={{
            snapDirection: 'left',
            stackInterval: 300,
          }}
          containerStyle={{
            flexGrow: 1,
          }}
          renderItem={({ item, index }) => (
            <SurveyStepForm
              key={index}
              currentStepId={currentStepId}
              value={value}
              step={item}
              onChange={onStepFormChange}
              onSkip={onSkip}
            />
          )}
        />
      )}
    </View>
  );
}
