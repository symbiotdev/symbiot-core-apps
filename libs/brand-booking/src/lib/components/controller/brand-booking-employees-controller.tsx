import { Control, Controller } from 'react-hook-form';
import { useMemo } from 'react';
import {
  Avatar,
  ButtonIcon,
  PickerOnChange,
  SelectPicker,
  Textarea,
} from '@symbiot-core-apps/ui';
import {
  BrandEmployee,
  useBrandEmployeeCurrentListReq,
} from '@symbiot-core-apps/api';
import { XStack } from 'tamagui';
import { BrandEmployeeItem } from '@symbiot-core-apps/brand';
import { useTranslation } from 'react-i18next';

export function BrandBookingEmployeesController(props: {
  control: Control<{
    details: {
      employee: string;
      note: string;
    };
  }>;
}) {
  const { t } = useTranslation();
  const { items, isPending, error } = useBrandEmployeeCurrentListReq({
    params: {
      take: 999,
    },
  });

  return (
    <Controller
      name="details"
      control={props.control}
      render={({ field: { value, onChange } }) => (
        <>
          <Employee
            value={value.employee}
            employees={items}
            loading={isPending}
            error={error}
            onChange={(employee) =>
              onChange({
                ...value,
                employee,
              })
            }
          />

          {!!value?.employee && (
            <Textarea
              countCharacters
              enterKeyHint="done"
              value={value.note}
              label={t(`unavailable_brand_booking.form.note.label`)}
              placeholder={t(`unavailable_brand_booking.form.note.placeholder`)}
              onChange={(note) =>
                onChange({
                  ...value,
                  note,
                })
              }
            />
          )}
        </>
      )}
    />
  );
}

const Employee = ({
  value,
  employees,
  loading,
  error,
  onChange,
}: {
  value?: string;
  employees?: BrandEmployee[];
  loading?: boolean;
  error?: string | null;
  onChange: PickerOnChange;
}) => {
  const { t } = useTranslation();

  const options = useMemo(
    () =>
      employees?.map((employee) => ({
        label: employee.name,
        value: employee.id,
        icon: (
          <Avatar
            name={employee.name}
            size={40}
            url={employee.avatar?.xsUrl}
            color={employee.avatarColor}
          />
        ),
      })),
    [employees],
  );

  const selectedEmployee = useMemo(
    () => employees?.find(({ id }) => id === value),
    [employees, value],
  );

  return (
    <SelectPicker
      required
      optionsCentered={false}
      value={value}
      placeholder={t('unavailable_brand_booking.form.employee.placeholder')}
      options={options}
      optionsLoading={loading}
      optionsError={error}
      trigger={
        selectedEmployee ? (
          <XStack alignItems="center" gap="$2" flex={1}>
            <BrandEmployeeItem
              flex={1}
              backgroundColor="$background1"
              borderRadius="$10"
              padding="$4"
              employee={selectedEmployee}
            />
            <ButtonIcon iconName="Pen" type="clear" />
          </XStack>
        ) : undefined
      }
      onChange={onChange}
    />
  );
};
