import { View, XStack, XStackProps } from 'tamagui';
import { memo, ReactElement } from 'react';
import { RegularText } from '../text/text';
import { Icon } from '../icons';
import { InitView } from '../view/init-view';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { IconName } from '../icons/config';
import { ContainerView } from '../view/container-view';

export type ToggleGroupItem = {
  value: unknown;
  label: string;
  description?: string;
  icon?: ReactElement;
};

export type ToggleGroupValue = unknown | unknown[];
export type ToggleOnChange = (value: ToggleGroupValue) => void;

export const toggleItemMinHeight = 24;
export const toggleGap = 12;

export const ToggleGroup = ({
  items,
  value,
  multiselect,
  ignoreHaptic,
  allowEmpty,
  loading,
  disabled,
  renderDelay,
  noDataIcon,
  noDataTitle,
  noDataMessage,
  error,
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
  renderDelay?: number;
  noDataIcon?: IconName;
  noDataTitle?: string;
  noDataMessage?: string;
  error?: string;
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
    <ContainerView
      gap={toggleGap}
      lazy={Boolean(renderDelay)}
      delay={renderDelay}
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
          onChange={onChange}
          {...itemProps}
        />
      ))}
    </ContainerView>
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
        ? value.includes(item.value)
        : value === item.value;

    const onPress = () => {
      if (multiselect && Array.isArray(value)) {
        if (selected && value.length === 1 && !allowEmpty) {
          return;
        } else if (selected) {
          onChange?.(value.filter((itemValue) => itemValue !== item.value));
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
