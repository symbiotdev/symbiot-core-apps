import { IconName } from '@symbiot-core-apps/ui';
import { SurveyIntro } from './survey-intro';
import { SurveyStep } from '../types/survey-step';
import { useCallback, useState } from 'react';
import { SurveyStepsFlow } from './survey-steps-flow';
import { useKeyboardDismisser } from '@symbiot-core-apps/shared';

export function Survey<V extends object>({
  currentStepId,
  steps,
  introIconName,
  setCurrentStepId,
  onFinish: onEmitFinish,
}: {
  steps: SurveyStep<V>[];
  introIconName: IconName;
  currentStepId?: string | null;
  setCurrentStepId: (id: string) => void;
  onFinish: (value: V) => void;
}) {
  const [value, setValue] = useState<V>({} as V);

  const onStart = useCallback(
    () => setCurrentStepId(steps[0].id),
    [setCurrentStepId, steps],
  );

  const goToNextStep = useKeyboardDismisser(
    useCallback(() => {
      const currentStep = steps.find(({ id }) => id === currentStepId);
      const nextStep = steps.find(({ id }) => id === currentStep?.nextId);

      if (nextStep) {
        setCurrentStepId(nextStep.id);
      }
    }, [currentStepId, setCurrentStepId, steps]),
  );

  const onChangeStepsFlow = useCallback(
    (value: V) => {
      setValue(value);

      goToNextStep();
    },
    [goToNextStep],
  );

  const onFinish = useCallback(
    () => onEmitFinish(value),
    [onEmitFinish, value],
  );

  return (
    <>
      {currentStepId === undefined && (
        <SurveyIntro iconName={introIconName} onStart={onStart} />
      )}

      {!!currentStepId && (
        <SurveyStepsFlow
          currentStepId={currentStepId}
          steps={steps}
          value={value}
          onChange={onChangeStepsFlow}
          onFinish={onFinish}
          onSkip={goToNextStep}
        />
      )}
    </>
  );
}
