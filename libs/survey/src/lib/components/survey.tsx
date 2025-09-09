import {
  headerBackButtonIconName,
  HeaderButton,
  LoadingView,
  Progress,
  useScreenHeaderHeight,
} from '@symbiot-core-apps/ui';
import { SurveyStep } from '../types/survey-step';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SurveyStepsFlow } from './survey-steps-flow';
import { ConfirmAlert, useKeyboardDismisser } from '@symbiot-core-apps/shared';
import { router, useNavigation } from 'expo-router';
import { EventArg, NavigationAction } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export function Survey<V extends object>({
  steps,
  ignoreNavigation,
  loading,
  onFinish: onEmitFinish,
}: {
  steps: SurveyStep<V>[];
  loading?: boolean;
  ignoreNavigation?: boolean;
  onFinish: (value: V) => void;
}) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const headerHeight = useScreenHeaderHeight();

  const valueRef = useRef<V>({} as V);

  const [currentStepId, setCurrentStepId] = useState<string>(steps[0].id);

  const progress = useMemo(
    () =>
      (100 / steps.length) *
      (steps.findIndex((step) => step.id === currentStepId) + 1),
    [currentStepId, steps],
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
      if (!currentStepId || ignoreNavigation) return;

      e.preventDefault();

      ConfirmAlert({
        title: t('shared.brand.create.discard.title'),
        message: t('shared.brand.create.discard.message'),
        callback: () => navigation.dispatch(e.data.action),
      });
    },
    [currentStepId, ignoreNavigation, t, navigation],
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
      gestureEnabled: false,
      headerShown: !loading && !ignoreNavigation,
      headerLeft: () => (
        <HeaderButton
          iconName={headerBackButtonIconName}
          onPress={goToPrevStep}
        />
      ),
    });
  }, [goToPrevStep, ignoreNavigation, loading, navigation, progress]);

  useEffect(() => {
    navigation.addListener('beforeRemove', onLeave);

    return () => {
      navigation.removeListener('beforeRemove', onLeave);
    };
  }, [onLeave, navigation]);

  if (loading || ignoreNavigation) {
    return <LoadingView />;
  }

  return (
    <>
      <Progress
        zIndex={1}
        top={headerHeight}
        height={2}
        left={0}
        position="absolute"
        value={progress}
      />

      <SurveyStepsFlow
        currentStepId={currentStepId}
        steps={steps}
        value={valueRef.current}
        onChange={onChange}
        onSkip={goToNextStep}
      />
    </>
  );
}
