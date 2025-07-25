import { useCallback, useRef } from 'react';
import DateTimePicker, {
  DateType,
  useDefaultStyles,
} from 'react-native-ui-datepicker';
import { AdaptivePopover } from '../popover/adaptive-popover';
import { Popover, useTheme, View, ViewProps } from 'tamagui';
import { RegularText } from '../text/text';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { FormField } from './form-field';
import { DateHelper } from '@symbiot-core-apps/shared';
import { Day } from 'date-fns/types';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { useScheme } from '@symbiot-core-apps/store';
import { Icon } from '../icons/icon';
import { InputFieldView } from '../view/input-field-view';

export const DatePicker = ({
  value,
  disabled,
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
  value?: Date | null;
  label?: string;
  error?: string;
  placeholder?: string;
  formatStr?: string;
  weekStartsOn?: Day;
  startDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (date: Date) => void;
}) => {
  const theme = useTheme();
  const { scheme } = useScheme();
  const { i18n } = useTranslation();
  const defaultStyles = useDefaultStyles(scheme);

  const ref = useRef<Popover>(null);

  const onPress = useCallback(() => impactAsync(ImpactFeedbackStyle.Light), []);

  const onChangeDate = useCallback(
    ({ date }: { date: DateType }) => {
      ref.current?.close();

      onChange?.(DateHelper.toDate(date as Date));

      void impactAsync(ImpactFeedbackStyle.Light);
    },
    [onChange],
  );

  return (
    <FormField label={label} error={error}>
      <AdaptivePopover
        ref={ref}
        disabled={disabled}
        triggerType="child"
        trigger={
          <InputFieldView disabled={disabled} {...viewProps} onPress={onPress}>
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
          paddingVertical={Platform.OS === 'web' ? '$5' : undefined}
          paddingHorizontal="$5"
          marginHorizontal="auto"
        >
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
              IconPrev: (
                <Icon.Dynamic type="Ionicons" name="chevron-back-outline" />
              ),
              IconNext: (
                <Icon.Dynamic type="Ionicons" name="chevron-forward-outline" />
              ),
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
        </View>
      </AdaptivePopover>
    </FormField>
  );
};
