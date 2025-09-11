import { useCallback, useRef } from 'react';
import DateTimePicker, {
  DateType,
  useDefaultStyles,
} from 'react-native-ui-datepicker';
import {
  AdaptivePopover,
  AdaptivePopoverRef,
} from '../popover/adaptive-popover';
import { useTheme, View, ViewProps } from 'tamagui';
import { RegularText } from '../text/text';
import { FormField } from './form-field';
import { DateHelper, emitHaptic, Weekday } from '@symbiot-core-apps/shared';
import { Platform } from 'react-native';
import { useScheme } from '@symbiot-core-apps/state';
import { InputFieldView } from '../view/input-field-view';
import { Icon } from '../icons';
import RNDatepicker from 'react-native-date-picker';
import { useTranslation } from 'react-i18next';

export const DatePicker = ({
  value,
  disabled,
  required,
  label,
  error,
  placeholder,
  formatStr,
  weekStartsOn,
  startDate,
  minDate,
  maxDate,
  onChange,
  ...viewProps
}: Omit<ViewProps, 'onPress'> & {
  value?: Date | null | string;
  label?: string;
  error?: string;
  placeholder?: string;
  formatStr?: string;
  required?: boolean;
  weekStartsOn?: Weekday;
  startDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (date: Date) => void;
}) => {
  const theme = useTheme();
  const { scheme } = useScheme();
  const { i18n } = useTranslation();
  const defaultStyles = useDefaultStyles(scheme);

  const popoverRef = useRef<AdaptivePopoverRef>(null);

  const onChangeDate = useCallback(
    ({ date }: { date: DateType }) => {
      popoverRef.current?.close();

      onChange?.(DateHelper.toDate(date as Date));

      emitHaptic();
    },
    [onChange],
  );

  return (
    <FormField label={label} error={error} required={required}>
      <AdaptivePopover
        ref={popoverRef}
        disabled={disabled}
        triggerType="child"
        sheetTitle={label}
        trigger={
          <InputFieldView disabled={disabled} {...viewProps}>
            <RegularText
              color={
                !value ? '$placeholderColor' : disabled ? '$disabled' : '$color'
              }
            >
              {value ? DateHelper.format(value, formatStr) : placeholder}
            </RegularText>
          </InputFieldView>
        }
      >
        <View
          maxWidth={Platform.OS === 'web' ? 350 : undefined}
          marginHorizontal="auto"
        >
          {Platform.OS === 'ios' ? (
            <RNDatepicker
              date={new Date(value || Date.now())}
              mode="date"
              locale={i18n.language}
              minimumDate={minDate}
              maximumDate={maxDate}
              theme={scheme}
              onDateChange={onChange}
            />
          ) : (
            <DateTimePicker
              showOutsideDays
              mode="single"
              date={value ?? undefined}
              locale={i18n.language}
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
              onChange={onChangeDate}
            />
          )}
        </View>
      </AdaptivePopover>
    </FormField>
  );
};
