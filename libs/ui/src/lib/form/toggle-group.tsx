import { View, ViewProps, XStack, XStackProps } from 'tamagui';
import { memo, ReactElement } from 'react';
import { RegularText } from '../text/text';
import { Icon } from '../icons';
import { InitView } from '../view/init-view';
import { emitHaptic, objectsEqual } from '@symbiot-core-apps/shared';
import { IconName } from '../icons/config';
import { ContainerView } from '../view/container-view';
import { FormField } from './form-field';

export type ToggleGroupItem = {
  value: unknown;
  label: string;
  description?: string;
  icon?: ReactElement;
};

export type ToggleGroupValue = unknown | unknown[];
export type ToggleOnChange = (value: ToggleGroupValue) => void;

export const toggleItemMinHeight = 24;

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
  renderDelay,
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
  renderDelay?: number;
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
      <ContainerView
        lazy={Boolean(renderDelay)}
        delay={renderDelay}
        onRendered={onRendered}
        {...viewProps}
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
            onChange={onChange}
            {...itemProps}
          />
        ))}
      </ContainerView>
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
    onChange,
    ...xStackProps
  }: XStackProps & {
    item: ToggleGroupItem;
    value: ToggleGroupValue;
    multiselect?: boolean;
    ignoreHaptic?: boolean;
    allowEmpty?: boolean;
    disabled?: boolean;
    onChange?: ToggleOnChange;
  }) => {
    const selected =
      multiselect && Array.isArray(value)
        ? value.some((valueItem) => objectsEqual(valueItem, item.value))
        : objectsEqual(value, item.value);

    const onPress = () => {
      if (multiselect && Array.isArray(value)) {
        if (selected && value.length === 1 && !allowEmpty) {
          return;
        } else if (selected) {
          onChange?.(
            value.filter((valueItem) => !objectsEqual(valueItem, item.value)),
          );
        } else {
          onChange?.([...value, item.value]);
        }
      } else {
        if (!allowEmpty) {
          onChange?.(item.value);
        } else {
          onChange?.(item.value === value ? null : item.value);
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
        paddingVertical="$3"
        disabled={disabled}
        cursor={!disabled && onChange ? 'pointer' : 'default'}
        disabledStyle={{ opacity: 0.8 }}
        pressStyle={!disabled && { opacity: 0.8 }}
        onPress={onPress}
        {...xStackProps}
      >
        {item.icon}

        <View
          flex={1}
          gap="$1"
          minHeight={toggleItemMinHeight}
          justifyContent="center"
        >
          <RegularText color={disabled ? '$disabled' : '$color'}>
            {item.label}
          </RegularText>

          {item.description && (
            <RegularText fontSize={12} color="$placeholderColor">
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
