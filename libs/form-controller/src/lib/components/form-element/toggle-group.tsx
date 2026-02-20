import { View, ViewProps, XStack, XStackProps } from 'tamagui';
import { memo, ReactElement } from 'react';
import { emitHaptic, isEqual } from '@symbiot-core-apps/shared';
import { Icon, IconName, InitView, RegularText } from '@symbiot-core-apps/ui';
import { FormField } from '../wrapper/form-field';
import { Container } from '@symbiot-core-apps/ui2';

export type ToggleGroupItem = {
  value: unknown;
  label: string;
  description?: string;
  icon?: ReactElement;
};

export type ToggleGroupValue = unknown | unknown[];
export type ToggleOnChange = (value: ToggleGroupValue) => void;

export const ToggleGroup = ({
  items,
  value,
  multiselect,
  ignoreHaptic,
  allowEmpty,
  loading,
  disabled,
  required,
  label,
  noDataIcon,
  noDataTitle,
  noDataMessage,
  error,
  viewProps,
  itemProps,
  onChange,
  onRendered,
}: {
  value: ToggleGroupValue;
  items?: ToggleGroupItem[];
  multiselect?: boolean;
  ignoreHaptic?: boolean;
  allowEmpty?: boolean;
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  noDataIcon?: IconName;
  noDataTitle?: string;
  noDataMessage?: string;
  error?: string | null;
  viewProps?: ViewProps;
  itemProps?: XStackProps;
  onChange?: ToggleOnChange;
  onRendered?: () => void;
}) =>
  !items?.length ? (
    <InitView
      loading={loading}
      error={error}
      noDataIcon={noDataIcon}
      noDataTitle={noDataTitle}
      noDataMessage={noDataMessage}
    />
  ) : (
    <FormField label={label} required={required}>
      <Container
        lazy={false}
        style={{ paddingBottom: 10 }}
        onRendered={onRendered}
      >
        {items?.map((item, index) => (
          <Item
            key={index}
            item={item}
            value={value}
            multiselect={multiselect}
            ignoreHaptic={ignoreHaptic}
            allowEmpty={allowEmpty}
            disabled={disabled}
            onToggle={onChange}
            {...itemProps}
          />
        ))}
      </Container>
    </FormField>
  );

const Item = memo(
  ({
    item,
    value,
    disabled,
    multiselect,
    ignoreHaptic,
    allowEmpty,
    onToggle,
    ...xStackProps
  }: Omit<XStackProps, 'onChange'> & {
    item: ToggleGroupItem;
    value: ToggleGroupValue;
    multiselect?: boolean;
    ignoreHaptic?: boolean;
    allowEmpty?: boolean;
    disabled?: boolean;
    onToggle?: ToggleOnChange;
  }) => {
    const selected =
      multiselect && Array.isArray(value)
        ? value.some((valueItem) => isEqual(valueItem, item.value))
        : isEqual(value, item.value);

    const onPress = () => {
      if (multiselect && Array.isArray(value)) {
        if (selected && value.length === 1 && !allowEmpty) {
          return;
        } else if (selected) {
          onToggle?.(
            value.filter((valueItem) => !isEqual(valueItem, item.value)),
          );
        } else {
          onToggle?.([...value, item.value]);
        }
      } else {
        if (!allowEmpty) {
          onToggle?.(item.value);
        } else {
          onToggle?.(item.value === value ? null : item.value);
        }
      }

      if (!ignoreHaptic) {
        emitHaptic();
      }
    };

    return (
      <XStack
        gap="$4"
        alignItems="center"
        paddingTop="$3"
        disabled={disabled}
        cursor={!disabled && onToggle ? 'pointer' : 'default'}
        disabledStyle={{ opacity: 0.5 }}
        pressStyle={!disabled && { opacity: 0.8 }}
        onPress={onPress}
        {...xStackProps}
      >
        {item.icon}

        <View flex={1} gap="$1" justifyContent="center">
          <RegularText
            color={disabled ? '$disabled' : '$color'}
            numberOfLines={1}
          >
            {item.label}
          </RegularText>

          {!!item.description && (
            <RegularText fontSize={12} color="$placeholder" numberOfLines={2}>
              {item.description}
            </RegularText>
          )}
        </View>

        {selected && (
          <Icon
            name="Unread"
            color={disabled ? '$disabled' : '$checkboxColor'}
          />
        )}
      </XStack>
    );
  },
);
