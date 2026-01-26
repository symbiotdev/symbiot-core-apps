import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import DateTimePicker, { useDefaultStyles } from 'react-native-ui-datepicker';
import { useTheme, ViewProps } from 'tamagui';
import {
  DateHelper,
  emitHaptic,
  useI18n,
  Weekday,
} from '@symbiot-core-apps/shared';
import { Platform } from 'react-native';
import { useCurrentAccountState, useScheme } from '@symbiot-core-apps/state';
import {
  AdaptivePopover,
  AdaptivePopoverRef,
  ContainerView,
  Icon,
  LightText,
} from '@symbiot-core-apps/ui';
import { FormField } from './form-field';
import { InputFieldView } from './input-field-view';
import RNDatepicker from 'react-native-date-picker';
import { MaskedTextInput } from 'react-native-mask-text';

type Value = Date | null | string;

export const DatePicker = ({
  value,
  required,
  disabled,
  disableDrag,
  label,
  error,
  placeholder,
  startDate,
  minDate,
  maxDate,
  onChange,
  onBlur,
  ...viewProps
}: Omit<ViewProps, 'onPress'> & {
  value: Value;
  label?: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disableDrag?: boolean;
  startDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (date: Date | null) => void;
  onBlur?: () => void;
}) => {
  const { me } = useCurrentAccountState();

  const dateFormat = me?.preferences?.dateFormat;
  const element = me?.preferences?.appearance?.date?.element;

  const onChangeDate = useCallback(
    (date: Date | null) =>
      onChange?.(date ? DateHelper.fromZonedTime(date, 'UTC') : null),
    [onChange],
  );

  return (
    <FormField label={label} error={error} required={required}>
      {element === 'input' ? (
        <DateAsTextField
          {...viewProps}
          value={value}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          dateFormat={dateFormat}
          placeholder={placeholder}
          onChange={onChangeDate}
          onBlur={onBlur}
        />
      ) : (
        <PopoverDateField
          {...viewProps}
          value={value}
          label={label}
          forceCalendar={element === 'calendar'}
          disabled={disabled}
          weekStartsOn={me?.preferences?.appearance?.calendar?.weekStartsOn}
          disableDrag={disableDrag}
          dateFormat={dateFormat}
          placeholder={placeholder}
          startDate={startDate}
          minDate={minDate}
          maxDate={maxDate}
          onChange={onChangeDate}
          onBlur={onBlur}
        />
      )}
    </FormField>
  );
};

const DateAsTextField = ({
  value,
  minDate,
  maxDate,
  placeholder,
  dateFormat = 'dd.MM.yyyy',
  onChange,
  onBlur,
  ...viewProps
}: Omit<ViewProps, 'onPress'> & {
  value?: Value;
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
  placeholder?: string;
  onBlur?: () => void;
  onChange?: (date: Date | null) => void;
}) => {
  const theme = useTheme();
  const { scheme } = useScheme();

  const adjustedValue = useMemo(
    () => ({
      value: value || null,
      label: value ? DateHelper.format(value, dateFormat) : '',
    }),
    [dateFormat, value],
  );

  const [focused, setFocused] = useState(false);
  const [fieldState, setFieldState] = useState(adjustedValue);

  const isMinDateValid = useCallback(
    (date: Date | null | string) =>
      !date ||
      !minDate ||
      DateHelper.isAfter(date, minDate) ||
      DateHelper.isSameDay(date, minDate),
    [minDate],
  );

  const isMaxDateValid = useCallback(
    (date: Date | null | string) =>
      !date ||
      !maxDate ||
      DateHelper.isBefore(date, maxDate) ||
      DateHelper.isSameDay(date, maxDate),
    [maxDate],
  );

  const onChangeText = useCallback(
    (label: string) => {
      const resetValue = () => {
        onChange?.(null);
        setFieldState({ value: null, label });
      };

      if (DateHelper.isValidByFormat(label, dateFormat)) {
        const value = DateHelper.getDateFromFormattedString(label, dateFormat);

        if (!isMinDateValid(value) || !isMaxDateValid(value)) {
          resetValue();
        } else {
          onChange?.(value);
          setFieldState({ value, label });
        }
      } else {
        resetValue();
      }
    },
    [dateFormat, isMinDateValid, isMaxDateValid, onChange],
  );

  const onFocus = useCallback(() => setFocused(true), []);

  const onBlurText = useCallback(() => {
    if (
      !isMinDateValid(fieldState.value) ||
      !isMaxDateValid(fieldState.value) ||
      !DateHelper.isValidByFormat(fieldState.label, dateFormat)
    ) {
      onChange?.(null);
      if (onBlur) setTimeout(onBlur, 100);
    } else {
      onBlur?.();
    }

    setFocused(false);
  }, [
    dateFormat,
    fieldState,
    isMinDateValid,
    isMaxDateValid,
    onBlur,
    onChange,
  ]);

  useLayoutEffect(() => {
    if (!focused && adjustedValue.label !== fieldState.label) {
      setFieldState(adjustedValue);
    }
  }, [focused, adjustedValue, fieldState.label]);

  return (
    <InputFieldView gap="$3" {...viewProps}>
      <MaskedTextInput
        type="date"
        keyboardType="numeric"
        textContentType="oneTimeCode" // https://github.com/facebook/react-native/issues/39411
        value={fieldState.label}
        placeholder={placeholder}
        placeholderTextColor={theme?.placeholderColor?.val}
        mask={dateFormat}
        options={{ dateFormat }}
        keyboardAppearance={scheme}
        style={{
          flex: 1,
          color: theme?.color?.val,
          outline: 'none',
          fontFamily: 'BodyLight',
        }}
        onFocus={onFocus}
        onBlur={onBlurText}
        onChangeText={onChangeText}
      />
    </InputFieldView>
  );
};

const DateAsCalendar = ({
  value,
  startDate,
  minDate,
  maxDate,
  weekStartsOn,
  onChange,
}: {
  value?: Value;
  startDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  weekStartsOn?: Weekday;
  onChange?: (date: Date | null) => void;
}) => {
  const { lang } = useI18n();
  const { scheme } = useScheme();
  const theme = useTheme();
  const defaultStyles = useDefaultStyles(scheme);

  return (
    <DateTimePicker
      showOutsideDays
      mode="single"
      date={value ?? undefined}
      locale={lang}
      startDate={startDate}
      minDate={minDate}
      maxDate={maxDate}
      firstDayOfWeek={weekStartsOn}
      components={{
        IconPrev: <Icon name="ArrowLeft" />,
        IconNext: <Icon name="ArrowRight" />,
      }}
      styles={{
        ...defaultStyles,
        selected: {
          ...defaultStyles.selected,
          backgroundColor: theme.buttonBackground?.val,
        },
        selected_label: {
          ...defaultStyles.selected_label,
          color: theme.$buttonTextColor?.val,
        },
        selected_month: {
          ...defaultStyles.selected_month,
          backgroundColor: theme.buttonBackground?.val,
        },
        selected_month_label: {
          ...defaultStyles.selected_month_label,
          color: theme.$buttonTextColor?.val,
        },
        selected_year: {
          ...defaultStyles.selected_year,
          backgroundColor: theme.buttonBackground?.val,
        },
        selected_year_label: {
          ...defaultStyles.selected_year_label,
          color: theme.$buttonTextColor?.val,
        },
        month_selector_label: {
          ...defaultStyles.month_selector_label,
          textTransform: 'capitalize',
          fontFamily: 'BodyRegular',
        },
        year_selector_label: {
          ...defaultStyles.year_selector_label,
          fontFamily: 'BodyRegular',
        },
        weekday_label: {
          ...defaultStyles.weekday_label,
          textTransform: 'lowercase',
          fontFamily: 'BodyRegular',
        },
        day_cell: {
          ...defaultStyles.day_cell,
          alignSelf: 'center',
          width: 45,
          height: 45,
        },
        day: {
          ...defaultStyles.day,
          borderRadius: 50,
        },
        day_label: {
          ...defaultStyles.day_label,
          fontFamily: 'BodyRegular',
        },
        month_label: {
          ...defaultStyles.month_label,
          fontFamily: 'BodyRegular',
        },
        year_label: {
          ...defaultStyles.year_label,
          fontFamily: 'BodyRegular',
        },
        year: {
          ...defaultStyles.year,
          borderRadius: 20,
          borderWidth: 0,
        },
        month: {
          ...defaultStyles.month,
          borderRadius: 20,
          borderWidth: 0,
        },
      }}
      onChange={({ date }) => {
        onChange?.(date as Date);
        emitHaptic();
      }}
    />
  );
};

const DateAsPicker = ({
  value,
  minDate,
  maxDate,
  onChange,
}: {
  value?: Value;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (date: Date | null) => void;
}) => {
  const { lang } = useI18n();
  const { scheme } = useScheme();

  return (
    <RNDatepicker
      date={new Date(value || Date.now())}
      mode="date"
      locale={lang}
      minimumDate={minDate}
      maximumDate={maxDate}
      theme={scheme}
      onDateChange={onChange}
    />
  );
};

const PopoverDateField = ({
  value,
  label,
  minDate,
  maxDate,
  disabled,
  startDate,
  dateFormat,
  disableDrag,
  placeholder,
  weekStartsOn,
  forceCalendar,
  onChange,
  onBlur,
  ...viewProps
}: Omit<ViewProps, 'onPress'> & {
  forceCalendar?: boolean;
  disableDrag?: boolean;
  dateFormat?: string;
  weekStartsOn?: Weekday;
  placeholder?: string;
  label?: string;
  value?: Value;
  startDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (date: Date | null) => void;
  onBlur?: () => void;
}) => {
  const popoverRef = useRef<AdaptivePopoverRef>(null);

  const onChangeCalendarDate = useCallback(
    (date: Date | null) => {
      popoverRef.current?.close();
      onChange?.(date);
      onBlur?.();
    },
    [onChange, onBlur],
  );

  return (
    <AdaptivePopover
      ref={popoverRef}
      disabled={disabled}
      disableDrag={disableDrag}
      sheetTitle={label}
      trigger={
        <InputFieldView pressStyle={{ opacity: 0.8 }} {...viewProps}>
          <LightText
            color={
              !value ? '$placeholderColor' : disabled ? '$disabled' : '$color'
            }
          >
            {value ? DateHelper.format(value, dateFormat) : placeholder}
          </LightText>
        </InputFieldView>
      }
      onClose={onBlur}
    >
      <ContainerView
        alignItems="center"
        maxWidth={Platform.OS === 'web' ? 350 : undefined}
      >
        {forceCalendar || Platform.OS !== 'ios' ? (
          <DateAsCalendar
            value={value}
            minDate={minDate}
            maxDate={maxDate}
            startDate={startDate}
            weekStartsOn={weekStartsOn}
            onChange={onChange}
          />
        ) : (
          <DateAsPicker
            value={value}
            minDate={minDate}
            maxDate={maxDate}
            onChange={onChangeCalendarDate}
          />
        )}
      </ContainerView>
    </AdaptivePopover>
  );
};
