import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Picker } from './picker';
import { ToggleOnChange } from './toggle-group';
import { FormView, formViewStyles } from '../view/form-view';
import { Segment } from '../segment/segment';
import { DateHelper } from '@symbiot-core-apps/shared';
import { AdaptivePopover } from '../popover/adaptive-popover';
import { LightText, RegularText } from '../text/text';
import { InputFieldView } from '../view/input-field-view';
import { YStack } from 'tamagui';
import { FormField } from './form-field';

const timeInterval = 5;

export const TimeSchedule = ({
  value,
  label,
  error,
  required,
  disabled,
  disableDrag,
  onChange,
  onBlur,
}: {
  value: { start: Date; end: Date };
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  disableDrag?: boolean;
  onChange: (params: { start: Date; end: Date }) => void;
  onBlur?: () => void;
}) => {
  const { t } = useTranslation();
  const startOfDay = DateHelper.startOfDay(value.start);

  const [activeSegment, setActiveSegment] = useState<string>('start');

  const minutes = useMemo(
    () => DateHelper.get24HoursInFormattedTime(timeInterval),
    [],
  );

  const endMinutes = useMemo(
    () =>
      minutes.filter((minuteItem) =>
        DateHelper.isAfter(
          DateHelper.addMinutes(startOfDay, minuteItem.value),
          value.start,
        ),
      ),
    [minutes, startOfDay, value.start],
  );

  const segmentItems = useMemo(
    () => [
      {
        placeholder: t('shared.schedule.start'),
        label: disabled ? '-' : DateHelper.format(value.start, 'p'),
        value: 'start',
      },
      {
        placeholder: t('shared.schedule.end'),
        label: disabled ? '-' : DateHelper.format(value.end, 'p'),
        value: 'end',
      },
    ],
    [value.end, disabled, value.start, t],
  );

  const onChangeStartValue = useCallback(
    (minutes: number) => {
      const adjustedStart = DateHelper.addMinutes(startOfDay, minutes);

      onChange({
        start: adjustedStart,
        end:
          DateHelper.isSame(adjustedStart, value.end) ||
          DateHelper.isAfter(adjustedStart, value.end)
            ? DateHelper.addMinutes(adjustedStart, timeInterval)
            : value.end,
      });
    },
    [startOfDay, onChange, value.end],
  );

  const onChangeEndValue = useCallback(
    (minutes: number) => {
      const adjustedEnd = DateHelper.addMinutes(startOfDay, minutes);

      onChange({
        end: adjustedEnd,
        start:
          DateHelper.isSame(value.start, adjustedEnd) ||
          DateHelper.isAfter(value.start, adjustedEnd)
            ? DateHelper.addMinutes(adjustedEnd, -timeInterval)
            : value.start,
      });
    },
    [startOfDay, onChange, value.start],
  );

  return (
    <AdaptivePopover
      ignoreScroll
      disableDrag={disableDrag}
      placement="bottom"
      maxHeight={300}
      minWidth={250}
      trigger={
        <YStack gap="$1" disabled={disabled} pressStyle={{ opacity: 0.8 }}>
          <FormField label={label} error={error} required={required}>
            <InputFieldView>
              <LightText>
                {`${DateHelper.format(value.start, 'p')} - ${DateHelper.format(value.end, 'p')}`}
              </LightText>
            </InputFieldView>
          </FormField>
          <RegularText color="$disabled" marginHorizontal="$4">
            {`${t('shared.duration')} - ${DateHelper.formatDuration(
              DateHelper.differenceInMinutes(value.end, value.start),
            )}`}
          </RegularText>
        </YStack>
      }
      topFixedContent={
        <Segment
          style={formViewStyles}
          disabled={disabled}
          value={activeSegment}
          items={segmentItems}
          onChange={setActiveSegment}
        />
      }
      onClose={onBlur}
    >
      <FormView>
        {activeSegment === 'start' && (
          <Picker
            lazy
            value={DateHelper.differenceInMinutes(value.start, startOfDay)}
            options={minutes}
            onChange={onChangeStartValue as ToggleOnChange}
          />
        )}

        {activeSegment === 'end' && (
          <Picker
            lazy
            value={DateHelper.differenceInMinutes(value.end, startOfDay)}
            options={endMinutes}
            onChange={onChangeEndValue as ToggleOnChange}
          />
        )}
      </FormView>
    </AdaptivePopover>
  );
};
