import { View } from 'tamagui';
import { SurveyStep } from '../types/survey-step';
import { useMemo } from 'react';
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
  DatePicker,
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  FormView,
  H2,
  Input,
  LinkItem,
  PhoneInput,
  PhoneValue,
  RegularText,
  Switch,
  Textarea,
  ToggleGroup,
  useScreenHeaderHeight,
  UsStatePicker,
  WeekdaySchedule,
  WeekdaysSchedule,
} from '@symbiot-core-apps/ui';
import { useCurrentAccount } from '@symbiot-core-apps/state';
import { useTranslation } from 'react-i18next';
import { CountryCode } from 'countries-and-timezones';
import { AddressPicker } from '@symbiot-core-apps/location';
import { DateHelper } from '@symbiot-core-apps/shared';
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export function SurveyStepForm<V>({
  value: formValue,
  currentStepId,
  step,
  onChange,
  onSkip,
}: {
  currentStepId: string;
  value: V;
  step: SurveyStep<V>;
  onChange: (value: V) => void;
  onSkip: () => void;
}) {
  const { t } = useTranslation();
  const { me } = useCurrentAccount();
  const headerHeight = useScreenHeaderHeight();
  const { bottom } = useSafeAreaInsets();

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

  return (
    <>
      {currentStepId === step.id && (
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          bottomOffset={100}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={Platform.OS === 'web'}
          contentContainerStyle={{
            paddingHorizontal: defaultPageHorizontalPadding,
          }}
        >
          <FormView
            flex={1}
            gap="$5"
            paddingTop={headerHeight + defaultPageVerticalPadding}
            paddingBottom={defaultPageVerticalPadding}
          >
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
                            regex={el.props.regex}
                            placeholder={el.props.placeholder}
                            onChange={onChange}
                          />
                        )}

                        {el.type === 'email' && (
                          <Input
                            enterKeyHint="next"
                            type="email"
                            keyboardType="email-address"
                            value={value as string}
                            error={error?.message}
                            label={el.props.label}
                            placeholder={el.props.placeholder}
                            onChange={onChange}
                          />
                        )}

                        {el.type === 'phone' && (
                          <PhoneInput
                            enterKeyHint="done"
                            value={value as PhoneValue}
                            label={el.props.label}
                            placeholder={el.props.placeholder}
                            error={error?.message}
                            onChange={onChange}
                          />
                        )}

                        {el.type === 'switch' && (
                          <Switch
                            label={el.props.label}
                            description={el.props.description}
                            checked={!!value}
                            onChange={onChange}
                          />
                        )}

                        {el.type === 'textarea' && (
                          <Textarea
                            countCharacters
                            enterKeyHint="done"
                            value={value as string}
                            error={error?.message}
                            label={el.props.label}
                            maxLength={el.props.maxLength}
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
                          <Card paddingVertical={0}>
                            <ToggleGroup
                              multiselect={el.props.multiselect}
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
                              formValue[el.props.stepValueKey as keyof V] ||
                                'S',
                            )}
                            color="$placeholderColor"
                            size={140}
                            marginTop="$10"
                            onAttach={onChange}
                          />
                        )}

                        {el.type === 'country' && (
                          <CountryPicker
                            value={value as CountryCode}
                            error={error?.message}
                            label={el.props.label}
                            sheetLabel={el.props.sheetLabel}
                            placeholder={el.props.placeholder}
                            onChange={onChange}
                          />
                        )}

                        {el.type === 'us-state' && (
                          <UsStatePicker
                            value={value as string}
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

                        {el.type === 'address' && (
                          <AddressPicker
                            value={value as string}
                            error={error?.message}
                            label={el.props.label}
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

                        {el.type === 'date-picker' && (
                          <DatePicker
                            value={value as Date}
                            error={error?.message}
                            formatStr={me?.preferences?.dateFormat}
                            weekStartsOn={me?.preferences?.weekStartsOn}
                            minDate={DateHelper.addYears(new Date(), -100)}
                            maxDate={new Date()}
                            label={el.props.label}
                            placeholder={el.props.placeholder}
                            onChange={onChange}
                          />
                        )}
                      </>
                    );
                  }}
                />
              ))}
          </FormView>
        </KeyboardAwareScrollView>
      )}

      <KeyboardStickyView
        offset={{ opened: bottom }}
        style={{
          marginTop: 'auto',
          paddingHorizontal: defaultPageHorizontalPadding,
          paddingBottom: bottom + defaultPageVerticalPadding,
        }}
      >
        <FormView gap={0}>
          <Button
            disabled={!isValid}
            label={t(step.nextId ? 'shared.next' : 'shared.finish')}
            onPress={handleSubmit(onChange as SubmitHandler<unknown>)}
          />

          {step.skippable && (
            <Button type="clear" label={t('shared.skip')} onPress={onSkip} />
          )}
        </FormView>
      </KeyboardStickyView>
    </>
  );
}
