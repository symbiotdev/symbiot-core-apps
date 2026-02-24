import {
  ForwardedRef,
  memo,
  ReactElement,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { emitHaptic, isEqual, isWeb } from '@symbiot-core-apps/shared';
import { AnimatedList, AnimatedListProps } from '../list/animated-list';
import { FlatList, Pressable, Text, View } from 'react-native';
import { DEFAULT_ICON_SIZE, Icon } from '../icon/icon';
import { FallbackView } from '../appearance/fallback-view';
import { useAppScheme } from '@symbiot-core-apps/state';

export type ToggleListValue =
  | ToggleListOption['value']
  | ToggleListOption['value'][];
export type ToggleListOnChange = (value: ToggleListValue) => void;
export type ToggleListOption = {
  label: string;
  value: string | number | object | null;
  description?: string;
  icon?: ReactElement;
};
export type ToggleListProps = Omit<
  AnimatedListProps<ToggleListOption>,
  'data' | 'renderItem'
> & {
  disabled?: boolean;
  multiselect?: boolean;
  allowEmpty?: boolean;
  moveSelectedToTop?: boolean;
  multiSelectHaptic?: boolean;
  singleSelectHaptic?: boolean;
  value?: ToggleListValue;
  options?: ToggleListOption[];
  fallbackOptions?: ToggleListOption[];
  optionsLoading?: boolean;
  optionsError?: string | null;
  noOptionsMessage?: string;
  listRef?: ForwardedRef<FlatList>;
  renderOption?: (props: {
    option: ToggleListOption;
    selected: boolean;
  }) => ReactElement;
  onChange?: ToggleListOnChange;
};

export const ToggleList = ({
  value,
  disabled,
  multiselect,
  allowEmpty,
  options,
  optionsError,
  optionsLoading,
  noOptionsMessage,
  fallbackOptions,
  singleSelectHaptic = true,
  multiSelectHaptic = true,
  moveSelectedToTop,
  renderOption,
  ListEmptyComponent,
  onChange,
  ...otherProps
}: ToggleListProps) => {
  const initialValue = useRef(value);

  const [sortedOptions, setSortedOptions] = useState<ToggleListOption[]>();

  const renderItem = useCallback(
    ({ item }: { item: ToggleListOption }) => (
      <Item
        item={item}
        value={value}
        disabled={disabled}
        allowEmpty={allowEmpty}
        multiselect={multiselect}
        multiSelectHaptic={multiSelectHaptic}
        singleSelectHaptic={singleSelectHaptic}
        renderOption={renderOption}
        onChange={onChange}
      />
    ),
    [
      value,
      disabled,
      allowEmpty,
      multiselect,
      multiSelectHaptic,
      singleSelectHaptic,
      renderOption,
      onChange,
    ],
  );

  useLayoutEffect(() => {
    if (!options) return;

    const value = initialValue.current;

    const sortedOptions = moveSelectedToTop
      ? [...options].sort((a, b) => {
          if (Array.isArray(value)) {
            if (value.some((valueItem) => isEqual(valueItem, a.value)))
              return -1;
            else
              return value.some((valueItem) => isEqual(valueItem, b.value))
                ? 1
                : 0;
          } else {
            if (isEqual(a.value, value)) return -1;
            else return isEqual(b.value, value) ? 1 : 0;
          }
        })
      : options;

    setSortedOptions(
      sortedOptions.length ? sortedOptions : fallbackOptions || [],
    );
  }, [fallbackOptions, moveSelectedToTop, options]);

  return (
    <AnimatedList
      showsVerticalScrollIndicator={isWeb}
      showsHorizontalScrollIndicator={false}
      {...otherProps}
      data={sortedOptions}
      renderItem={renderItem}
      ListEmptyComponent={
        ListEmptyComponent || (
          <FallbackView
            loading={optionsLoading}
            error={optionsError}
            noDataMessage={noOptionsMessage}
          />
        )
      }
    />
  );
};

const Item = memo(
  ({
    item,
    value,
    disabled,
    allowEmpty,
    multiselect,
    multiSelectHaptic,
    singleSelectHaptic,
    renderOption,
    onChange,
  }: Pick<
    ToggleListProps,
    | 'disabled'
    | 'allowEmpty'
    | 'multiselect'
    | 'renderOption'
    | 'multiSelectHaptic'
    | 'singleSelectHaptic'
    | 'onChange'
  > & {
    item: ToggleListOption;
    value?: ToggleListValue;
  }) => {
    const { scheme } = useAppScheme();
    // fixme colorize
    const color = scheme === 'dark' ? '#FFFFFF' : '#000000';

    const valueAsArr = useMemo(
      () =>
        Array.isArray(value) ? value : [value].filter((v) => v !== undefined),
      [value],
    );

    const selected = useMemo(
      () => valueAsArr.some((value) => isEqual(value, item.value)),
      [item.value, valueAsArr],
    );

    const onPress = useCallback(() => {
      if (disabled || !onChange) return;

      if (multiselect) {
        if (selected && valueAsArr.length === 1 && !allowEmpty) {
          return;
        } else {
          multiSelectHaptic && emitHaptic();

          onChange(
            selected
              ? valueAsArr.filter((value) => !isEqual(value, item.value))
              : [...valueAsArr, item.value],
          );
        }
      } else {
        singleSelectHaptic && emitHaptic();

        onChange(allowEmpty ? (selected ? null : item.value) : item.value);
      }
    }, [
      item.value,
      disabled,
      onChange,
      selected,
      valueAsArr,
      allowEmpty,
      multiselect,
      multiSelectHaptic,
      singleSelectHaptic,
    ]);

    return (
      <Pressable
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          cursor: 'pointer',
          gap: 10,
          paddingVertical: 10,
          opacity: pressed ? 0.8 : 1,
          ...(disabled && {
            pointerEvents: 'none',
            cursor: 'auto',
            opacity: 0.5,
          }),
        })}
        onPress={onPress}
      >
        {renderOption?.({ option: item, selected }) || (
          <>
            {item.icon}

            <View
              style={{
                justifyContent: 'center',
                gap: 2,
                flexShrink: 1,
                minHeight: DEFAULT_ICON_SIZE,
              }}
            >
              <Text style={{ color }} numberOfLines={1}>
                {item.label}
              </Text>

              {!!item.description && (
                <Text
                  numberOfLines={1}
                  // fixme - colorize
                  style={{ color: '#999999', fontSize: 12 }}
                >
                  {item.description}
                </Text>
              )}
            </View>

            {selected ? (
              // fixme - colorize
              <Icon
                name="Unread"
                style={{ marginLeft: 'auto' }}
                color={disabled ? '#999999' : undefined}
              />
            ) : (
              <View style={{ width: 24 }} />
            )}
          </>
        )}
      </Pressable>
    );
  },
);
