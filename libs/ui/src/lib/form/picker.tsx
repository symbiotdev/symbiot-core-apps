import { Picker as RNPicker } from '@react-native-picker/picker';
import {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTheme, View, ViewProps, XStack } from 'tamagui';
import { FlatList, Platform } from 'react-native';
import { InitView } from '../view/init-view';
import { RegularText } from '../text/text';
import { Icon } from '../icons';
import { toggleItemMinHeight } from './toggle-group';
import { defaultPageHorizontalPadding } from '../view/page-view';
import { emitHaptic, useRendered } from '@symbiot-core-apps/shared';
import { LoadingView } from '../view/loading-view';

export type PickerItem = {
  label: string;
  value: string | number | undefined;
  description?: string; // not applicable on IOS
  icon?: ReactElement; // not applicable on IOS
};

export type PickerOnChange = (value: unknown) => void;

export const Picker = ({
  value,
  options,
  optionsLoading,
  optionsError,
  disabled,
  lazy,
  moveSelectedToTop,
  onChange,
  ...viewProps
}: Omit<ViewProps, 'onMoveShouldSetResponder'> & {
  value?: unknown;
  options?: PickerItem[];
  optionsLoading?: boolean;
  optionsError?: string | null;
  disabled?: boolean;
  lazy?: boolean; // not applicable on IOS
  moveSelectedToTop?: boolean; // not applicable on IOS
  onChange?: PickerOnChange;
}) => {
  const theme = useTheme();
  const [selectedValue, setSelectedValue] = useState(value);

  const adjustedOptions = useMemo(
    () =>
      moveSelectedToTop && Platform.OS !== 'ios'
        ? options?.sort((a, b) =>
            a.value === value ? -1 : b.value === value ? 1 : 0,
          )
        : options,
    [options, moveSelectedToTop, value],
  );

  const onValueChange = useCallback(
    (newValue: string) => {
      setSelectedValue(newValue);
      onChange?.(newValue);
    },
    [onChange],
  );

  if (!adjustedOptions?.length) {
    return <InitView loading={optionsLoading} error={optionsError} />;
  }

  return Platform.OS === 'ios' ? (
    <View
      disabled={disabled}
      onMoveShouldSetResponder={(e) => {
        e.stopPropagation();

        return false;
      }}
      {...viewProps}
    >
      <RNPicker
        selectedValue={selectedValue as string}
        onValueChange={onValueChange}
        itemStyle={{ fontFamily: 'BodyMedium', color: theme.color?.val }}
      >
        {adjustedOptions.map((option, index) => (
          <RNPicker.Item
            key={index}
            label={option.label}
            value={option.value}
          />
        ))}
      </RNPicker>
    </View>
  ) : (
    <CustomPicker
      value={selectedValue}
      options={adjustedOptions}
      disabled={disabled}
      lazy={lazy}
      ignoreScrollTopOnChange={!moveSelectedToTop}
      onChange={onValueChange as PickerOnChange}
    />
  );
};

const CustomPicker = ({
  value,
  options,
  disabled,
  ignoreScrollTopOnChange,
  lazy,
  onChange,
}: {
  value?: unknown;
  disabled?: boolean;
  ignoreScrollTopOnChange?: boolean;
  lazy?: boolean;
  options: PickerItem[];
  onChange: PickerOnChange;
}) => {
  const { rendered } = useRendered({ defaultTrue: !lazy, delay: 300 });

  const initialSelectedIndexRef = useRef(
    options.findIndex((item) => item.value === value),
  );
  const flatListRef = useRef<FlatList>(null);

  const scrollToIndex = useCallback((index: number) => {
    if (index < 0) {
      return;
    }

    flatListRef.current?.scrollToIndex({
      index,
      animated: false,
      viewPosition: 0.5,
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: PickerItem }) => {
      return (
        <XStack
          gap="$4"
          alignItems="center"
          paddingVertical={10}
          paddingHorizontal={defaultPageHorizontalPadding}
          disabled={disabled}
          backgroundColor={value === item.value ? '$background' : undefined}
          borderRadius="$10"
          cursor={!disabled ? 'pointer' : 'default'}
          disabledStyle={{ opacity: 0.8 }}
          pressStyle={!disabled && { opacity: 0.8 }}
          onPress={() => {
            onChange(item.value as string);

            emitHaptic();

            if (!ignoreScrollTopOnChange) {
              scrollToIndex(0);
            }
          }}
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

          {value === item.value && (
            <Icon
              name="Unread"
              color={disabled ? '$disabled' : '$checkboxColor'}
            />
          )}
        </XStack>
      );
    },
    [disabled, ignoreScrollTopOnChange, scrollToIndex, onChange, value],
  );

  useEffect(() => {
    if (rendered) {
      scrollToIndex(initialSelectedIndexRef.current);
    }
  }, [rendered, scrollToIndex]);

  if (!rendered) {
    return <LoadingView flex={1} height={300} maxHeight="100%" />;
  }

  return (
    <FlatList
      ref={flatListRef}
      data={options}
      initialNumToRender={options.length}
      keyExtractor={(item) => String(item.value)}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={{ maxHeight: 300 }}
      contentContainerStyle={{
        paddingHorizontal: defaultPageHorizontalPadding,
      }}
      renderItem={renderItem}
      onScrollToIndexFailed={(info) =>
        setTimeout(() => scrollToIndex(info.index))
      }
      onMoveShouldSetResponder={(e) => {
        e.stopPropagation();

        return false;
      }}
    />
  );
};
