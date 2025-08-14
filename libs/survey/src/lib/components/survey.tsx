import {
  headerBackButtonIconName,
  HeaderButton,
  IconName,
  LoadingView,
  Progress,
} from '@symbiot-core-apps/ui';
import { SurveyIntro } from './survey-intro';
import { SurveyStep } from '../types/survey-step';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SurveyStepsFlow } from './survey-steps-flow';
import { ConfirmAlert, useKeyboardDismisser } from '@symbiot-core-apps/shared';
import { router, useNavigation } from 'expo-router';
import { useT } from '@symbiot-core-apps/i18n';
import { EventArg, NavigationAction } from '@react-navigation/native';

export function Survey<V extends object>({
  steps,
  introIconName,
  introTitle,
  introSubtitle,
  introActionLabel,
  ignoreLeaveConfirmation,
  loading,
  onFinish: onEmitFinish,
}: {
  steps: SurveyStep<V>[];
  introTitle: string;
  introSubtitle: string;
  introActionLabel: string;
  introIconName: IconName;
  loading?: boolean;
  ignoreLeaveConfirmation?: boolean;
  onFinish: (value: V) => void;
}) {
  const { t } = useT();
  const navigation = useNavigation();

  const valueRef = useRef<V>({} as V);

  const [currentStepId, setCurrentStepId] = useState<string>();

  const progress = useMemo(
    () =>
      (100 / steps.length) *
      (steps.findIndex((step) => step.id === currentStepId) + 1),
    [currentStepId, steps],
  );

  const onStart = useCallback(
    () => setCurrentStepId(steps[0].id),
    [setCurrentStepId, steps],
  );

  const goToPrevStep = useKeyboardDismisser(
    useCallback(() => {
      const currentStep = steps.find(({ id }) => id === currentStepId);
      const prevStep = steps.find(({ nextId }) => nextId === currentStep?.id);

      if (prevStep) {
        setCurrentStepId(prevStep.id);
      } else {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/');
        }
      }
    }, [currentStepId, steps]),
  );

  const goToNextStep = useKeyboardDismisser(
    useCallback(() => {
      const currentStep = steps.find(({ id }) => id === currentStepId);
      const nextStep = steps.find(({ id }) => id === currentStep?.nextId);

      if (nextStep) {
        setCurrentStepId(nextStep.id);
      } else {
        onEmitFinish(valueRef.current);
      }
    }, [currentStepId, onEmitFinish, steps]),
  );

  const onLeave = useCallback(
    (e: EventArg<'beforeRemove', true, { action: NavigationAction }>) => {
      if (!currentStepId || ignoreLeaveConfirmation) return;

      e.preventDefault();

      ConfirmAlert({
        title: t('brand.create.discard.title'),
        message: t('brand.create.discard.message'),
        callback: () => navigation.dispatch(e.data.action),
      });
    },
    [currentStepId, ignoreLeaveConfirmation, t, navigation],
  );

  const onChange = useCallback(
    (value: V) => {
      valueRef.current = {
        ...valueRef.current,
        ...value,
      };

      goToNextStep();
    },
    [goToNextStep],
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        !loading && (
          <HeaderButton
            iconName={headerBackButtonIconName}
            onPress={goToPrevStep}
          />
        ),
      headerTitle: () =>
        !loading && !!progress && <Progress value={progress} maxWidth={150} />,
    });
  }, [progress, goToPrevStep, navigation, loading]);

  useEffect(() => {
    navigation.addListener('beforeRemove', onLeave);

    return () => {
      navigation.removeListener('beforeRemove', onLeave);
    };
  }, [onLeave, navigation]);

  if (loading) {
    return <LoadingView />;
  }

  return (
    <>
      {currentStepId === undefined && (
        <SurveyIntro
          iconName={introIconName}
          title={introTitle}
          subtitle={introSubtitle}
          actionLabel={introActionLabel}
          onStart={onStart}
        />
      )}

      {!!currentStepId && (
        <SurveyStepsFlow
          currentStepId={currentStepId}
          steps={steps}
          value={valueRef.current}
          onChange={onChange}
          onSkip={goToNextStep}
        />
      )}
    </>
  );
}
