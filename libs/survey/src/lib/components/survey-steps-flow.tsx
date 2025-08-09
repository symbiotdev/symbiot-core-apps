import { useCallback, useEffect, useRef } from 'react';
import { SurveyStep } from '../types/survey-step';
import { View } from 'tamagui';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useWindowDimensions } from 'react-native';
import { SurveyStepForm } from './survey-step-form';
import { useKeyboardDismisser } from '@symbiot-core-apps/shared';

export function SurveyStepsFlow<V>({
  value,
  currentStepId,
  steps,
  onChange,
  onFinish,
  onSkip,
}: {
  value: V;
  currentStepId: string;
  steps: SurveyStep<V>[];
  onChange: (value: V) => void;
  onFinish: () => void;
  onSkip: () => void;
}) {
  const { width } = useWindowDimensions();
  const carouselRef = useRef<ICarouselInstance>(null);

  const onStepFormChange = useKeyboardDismisser(
    useCallback(onChange, [onChange]),
  );

  useEffect(() => {
    const nextIndex = steps.findIndex(({ id }) => id === currentStepId);
    const carousel = carouselRef.current;

    if (carousel && nextIndex !== carousel.getCurrentIndex()) {
      carousel.scrollTo({
        index: nextIndex,
        animated: true,
      });
    }
  }, [currentStepId, steps]);

  return (
    <View
      flex={1}
      animation="medium"
      opacity={1}
      enterStyle={{ opacity: 0 }}
      exitStyle={{ opacity: 0 }}
      id="survey-steps-flow"
      dataSet={{ kind: 'basic-layouts', name: 'normal' }}
    >
      <Carousel
        enabled={false}
        loop={false}
        ref={carouselRef}
        width={width}
        data={steps}
        modeConfig={{
          snapDirection: 'left',
          stackInterval: 100,
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
            onFinish={onFinish}
            onSkip={onSkip}
          />
        )}
      />
    </View>
  );
}
