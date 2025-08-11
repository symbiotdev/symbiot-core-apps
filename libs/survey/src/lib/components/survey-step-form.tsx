import { View } from 'tamagui';
import { SurveyStep } from '../types/survey-step';
import { useCallback, useMemo } from 'react';
import * as yup from 'yup';
import { ObjectShape } from 'yup';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  AppLinkInput,
  AvatarPicker,
  Button,
  Card,
  CountryPicker,
  CurrencyPicker,
  FormView,
  H2,
  Input,
  LinkItem,
  PageView,
  RegularText,
  ToggleGroup,
  WeekdaySchedule,
  WeekdaysSchedule,
} from '@symbiot-core-apps/ui';
import { useT } from '@symbiot-core-apps/i18n';
import { TCountryCode } from 'countries-list';
import { useMe } from '@symbiot-core-apps/state';

export function SurveyStepForm<V>({
  value: formValue,
  currentStepId,
  step,
  onChange,
  onFinish,
  onSkip,
}: {
  currentStepId: string;
  value: V;
  step: SurveyStep<V>;
  onChange: (value: V) => void;
  onFinish: () => void;
  onSkip: () => void;
}) {
  const { t } = useT();
  const { me } = useMe();

  const formSchema = useMemo(
    () =>
      yup
        .object()
        .shape(
          step.elements.reduce(
            (stepObj, el) => ({
              ...stepObj,
              [el.props.name]: el.props.scheme,
            }),
            {} as ObjectShape,
          ),
        )
        .required(),
    [step],
  );
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: step.elements.reduce(
      (stepObj, el) => ({
        ...stepObj,
        [el.props.name]: el.props.defaultValue,
      }),
      {},
    ),
  });

  const finish = useCallback(
    (value: V) => {
      onChange(value);
      onFinish();
    },
    [onChange, onFinish],
  );

  return (
    currentStepId === step.id && (
      <PageView scrollable withHeaderHeight withKeyboard lazy>
        <FormView flex={1} gap="$4">
          <View gap="$2">
            <H2>{step.title}</H2>
            <RegularText>{step.subtitle}</RegularText>
          </View>

          {step.elements
            .filter(
              (el) => !el.props.showWhen || el.props.showWhen(watch() as V),
            )
            .map((el, index) => (
              <Controller
                key={index}
                control={control}
                name={el.props.name}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => {
                  return (
                    <>
                      {el.type === 'input' && (
                        <Input
                          autoCapitalize="words"
                          value={value as string}
                          enterKeyHint={el.props.enterKeyHint || 'done'}
                          error={error?.message}
                          label={el.props.label}
                          placeholder={el.props.placeholder}
                          onChange={onChange}
                        />
                      )}

                      {el.type === 'app-link' && (
                        <AppLinkInput
                          autoCapitalize="none"
                          type={el.props.type}
                          value={value as LinkItem}
                          enterKeyHint={el.props.enterKeyHint || 'done'}
                          error={error?.message}
                          label={el.props.label}
                          placeholder={el.props.placeholder}
                          onChange={onChange}
                        />
                      )}

                      {el.type === 'toggle-group' && (
                        <Card>
                          <ToggleGroup
                            multiselect={false}
                            items={el.props.options}
                            loading={el.props.optionsLoading}
                            value={value as []}
                            error={error?.message}
                            onChange={onChange}
                          />
                        </Card>
                      )}

                      {el.type === 'avatar' && (
                        <AvatarPicker
                          url={value as string}
                          alignSelf="center"
                          name={String(
                            formValue[el.props.stepValueKey as keyof V] || 'S',
                          )}
                          color="$placeholderColor"
                          size={140}
                          marginTop="$10"
                          onAttach={(images) => onChange(images[0])}
                        />
                      )}

                      {el.type === 'country' && (
                        <CountryPicker
                          value={value as TCountryCode}
                          error={error?.message}
                          label={el.props.label}
                          sheetLabel={el.props.sheetLabel}
                          placeholder={el.props.placeholder}
                          onChange={onChange}
                        />
                      )}

                      {el.type === 'currency' && (
                        <CurrencyPicker
                          value={value as string}
                          error={error?.message}
                          label={el.props.label}
                          sheetLabel={el.props.sheetLabel}
                          placeholder={el.props.placeholder}
                          onChange={onChange}
                        />
                      )}

                      {el.type === 'weekdays-schedule' && (
                        <WeekdaysSchedule
                          value={value as WeekdaySchedule[]}
                          weekStartsOn={me?.preferences?.weekStartsOn}
                          onChange={onChange}
                        />
                      )}
                    </>
                  );
                }}
              />
            ))}

          <View marginTop="auto">
            {step.nextId ? (
              <Button
                disabled={!isValid}
                label={t('next')}
                onPress={handleSubmit(onChange as SubmitHandler<unknown>)}
              />
            ) : (
              <Button
                disabled={!isValid}
                label={t('finish')}
                onPress={handleSubmit(finish as SubmitHandler<unknown>)}
              />
            )}

            {step.skippable && (
              <Button
                type="clear"
                label={t('skip')}
                onPress={step.nextId ? onSkip : onFinish}
              />
            )}
          </View>
        </FormView>
      </PageView>
    )
  );
}
