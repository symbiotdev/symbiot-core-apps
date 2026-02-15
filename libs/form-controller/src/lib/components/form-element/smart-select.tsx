import { ReactElement, useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, Modal, useWindowDimensions } from 'react-native';
import { InputFieldView } from '../wrapper/input-field-view';
import {
  AnimatedList,
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
  EmptyView,
  InitView,
  LightText,
  ModalHeader,
  NavigationBackground,
  RegularText,
  Spinner,
} from '@symbiot-core-apps/ui';
import { View, XStack } from 'tamagui';
import {
  emitHaptic,
  isTablet,
  isWeb,
  useI18n,
  useKeyboard,
} from '@symbiot-core-apps/shared';
import { Search } from './search';
import { PickerItem } from './picker';
import { FormField } from '../wrapper/form-field';

export type SmartSelectValue = unknown | unknown[];
export type SmartSelectOnChange = (value: SmartSelectValue) => void;
export type SmartSelectOption = {
  label: string;
  value: string | number | null;
  description?: string; // not applicable on IOS
  icon?: ReactElement; // not applicable on IOS
};

const isBigScreen = isWeb || isTablet;

export const SmartSelect = ({
  value,
  label,
  error,
  placeholder,
  disabled,
  loading,
  required,
  multiselect,
  showSelectedDescription,
  moveSelectedToTop = true,
  searchable = true,
  searchDebounce = 300,
  searchPlaceholder,
  noSelectedValue,
  options,
  fallbackOptions,
  optionsLoading,
  optionsError,
  optionsTitle,
  trigger,
  onChange,
  onBlur,
}: {
  value?: SmartSelectValue;
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  multiselect?: boolean;
  moveSelectedToTop?: boolean;
  showSelectedDescription?: boolean;
  noSelectedValue?: string;
  searchable?: boolean;
  searchDebounce?: number;
  searchPlaceholder?: string;
  options?: SmartSelectOption[];
  fallbackOptions?: SmartSelectOption[];
  optionsLoading?: boolean;
  optionsError?: string | null;
  optionsTitle?: string;
  trigger?: ReactElement;
  onChange: SmartSelectOnChange;
  onBlur?: () => void;
}) => {
  const [state, setState] = useState({
    modalRendered: false,
    modalVisible: false,
  });

  const formattedValue = useMemo(() => {
    let checkedValue: string | undefined;

    if (value !== undefined) {
      if (Array.isArray(value)) {
        checkedValue = value
          .map(
            (valueItem) =>
              options?.find((option) => option.value === valueItem)?.label,
          )
          .filter(Boolean)
          .join(', ');
      } else {
        checkedValue = options?.find((option) => option.value === value)?.label;
      }
    }

    return checkedValue || noSelectedValue;
  }, [noSelectedValue, options, value]);

  const description = useMemo(() => {
    if (!showSelectedDescription || value === undefined) return;

    return (
      Array.isArray(value)
        ? value.find((valueItem) =>
            options?.some((option) => option.value === valueItem),
          )
        : options?.find((option) => option.value === value)
    )?.description;
  }, [options, showSelectedDescription, value]);

  const onOpenList = useCallback(() => {
    emitHaptic();
    setState((prev) => ({
      ...prev,
      modalRendered: true,
      modalVisible: true,
    }));
  }, []);

  const onCloseModalList = useCallback(() => {
    emitHaptic();
    setState((prev) => ({
      ...prev,
      modalVisible: false,
    }));

    onBlur?.();
  }, [onBlur]);

  const areOptionsLoading = !options && optionsLoading;

  return (
    <>
      <FormField
        required={required}
        label={label}
        error={error}
        description={description}
      >
        <View
          gap="$2"
          cursor="pointer"
          disabled={disabled}
          disabledStyle={{ opacity: 0.5 }}
          pressStyle={{ opacity: 0.8 }}
          onPress={onOpenList}
        >
          {trigger || (
            <InputFieldView gap="$3">
              {areOptionsLoading || !formattedValue ? (
                <LightText color="$placeholder" flex={1} numberOfLines={1}>
                  {placeholder}
                </LightText>
              ) : (
                <LightText
                  flex={1}
                  numberOfLines={1}
                  color={disabled ? '$disabled' : '$color'}
                >
                  {formattedValue}
                </LightText>
              )}

              {(loading || areOptionsLoading) && (
                <Spinner marginLeft="auto" width={16} height={16} />
              )}
            </InputFieldView>
          )}
        </View>
      </FormField>

      {state.modalRendered && (
        <Modal
          presentationStyle="formSheet"
          transparent={isBigScreen}
          visible={state.modalVisible}
          animationType={isBigScreen ? 'fade' : 'slide'}
          pointerEvents="box-none"
          supportedOrientations={['portrait', 'landscape']}
          onRequestClose={onCloseModalList}
        >
          <NavigationBackground onPress={onCloseModalList} />

          <OptionsList
            value={value}
            title={optionsTitle || label}
            disabled={disabled}
            multiselect={multiselect}
            searchable={searchable}
            searchDebounce={searchDebounce}
            searchPlaceholder={searchPlaceholder}
            options={options}
            fallbackOptions={fallbackOptions}
            optionsLoading={optionsLoading}
            optionsError={optionsError}
            moveSelectedToTop={moveSelectedToTop}
            onSelect={onChange}
            onClose={onCloseModalList}
          />
        </Modal>
      )}
    </>
  );
};

const OptionsList = ({
  title,
  value,
  disabled,
  multiselect,
  searchable = true,
  searchDebounce = 300,
  searchPlaceholder,
  options,
  fallbackOptions,
  optionsLoading,
  optionsError,
  moveSelectedToTop,
  onSelect,
  onClose,
}: {
  value?: SmartSelectValue;
  title?: string;
  disabled?: boolean;
  multiselect?: boolean;
  searchable?: boolean;
  searchDebounce?: number;
  searchPlaceholder?: string;
  options?: SmartSelectOption[];
  fallbackOptions?: SmartSelectOption[];
  optionsLoading?: boolean;
  optionsError?: string | null;
  moveSelectedToTop?: boolean;
  onSelect: SmartSelectOnChange;
  onClose: () => void;
}) => {
  const { t } = useI18n();
  const { shown: keyboardShown } = useKeyboard();
  const { width, height } = useWindowDimensions();
  const { currentHeight: keyboardHeight } = useKeyboard();

  const scrollingRef = useRef<boolean>(false);
  const flatListRef = useRef<FlatList>(null);
  const sortedOptions = useRef(
    moveSelectedToTop
      ? options?.sort((a, b) => {
          if (Array.isArray(value)) {
            return value.includes(a.value)
              ? -1
              : value.includes(b.value)
                ? 1
                : 0;
          } else {
            return a.value === value ? -1 : b.value === value ? 1 : 0;
          }
        })
      : options,
  );

  const [searchValue, setSearchValue] = useState('');

  const adjustedOptions = useMemo(() => {
    const filteredOptions = sortedOptions.current?.filter(
      (option) =>
        option.label
          .toLowerCase()
          .replace(/[^\p{L}\p{N}]/gu, '')
          .indexOf(searchValue.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')) !==
        -1,
    );

    return filteredOptions?.length ? filteredOptions : fallbackOptions;
  }, [searchValue, fallbackOptions]);

  const search = useCallback((text: string) => {
    setSearchValue(text);
    scrollingRef.current = false;

    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: PickerItem }) => (
      <XStack
        gap="$2"
        alignItems="center"
        paddingVertical="$3"
        disabled={disabled}
        paddingHorizontal={defaultPageHorizontalPadding}
        marginRight={defaultPageHorizontalPadding}
        borderRadius="$10"
        cursor={!disabled ? 'pointer' : 'default'}
        disabledStyle={{ opacity: 0.5 }}
        pressStyle={!disabled && { opacity: 0.8 }}
        {...{
          // the issue on ios - onPress not working when keyboard is opened
          [isWeb || !keyboardShown ? 'onPress' : 'onTouchEnd']: () => {
            if (scrollingRef.current) return;

            onSelect(item.value);

            if (!multiselect) {
              onClose();
            } else {
              emitHaptic();
            }
          },
        }}
      >
        {item.icon}

        <View gap="$1" flex={1} justifyContent="center" maxWidth="80%">
          <RegularText
            numberOfLines={1}
            color={disabled ? '$disabled' : '$color'}
          >
            {item.label}
          </RegularText>

          {item.description && (
            <RegularText fontSize={12} color="$placeholder">
              {item.description}
            </RegularText>
          )}
        </View>

        {value === item.value && (
          <View
            marginLeft="auto"
            width={8}
            height={16}
            borderBottomWidth={2}
            borderRightWidth={2}
            borderColor="$color"
            transform={[{ rotate: '45deg' }]}
          />
        )}
      </XStack>
    ),
    [disabled, value, keyboardShown, multiselect, onClose, onSelect],
  );

  const ListEmptyComponent = useCallback(
    () =>
      !options && !searchValue ? (
        <InitView loading={optionsLoading} error={optionsError} />
      ) : (
        <EmptyView iconName="Magnifer" message={t('shared.nothing_found')} />
      ),
    [options, optionsError, optionsLoading, searchValue, t],
  );

  return (
    <View
      {...(isBigScreen && {
        maxWidth: Math.min(width - 100, 600),
        maxHeight: Math.min(800, height - 100),
        minHeight: 200,
        borderRadius: 24,
        borderWidth: 1,
        width: '100%',
        margin: 'auto',
      })}
      flex={isWeb ? undefined : 1}
      backgroundColor="$background"
      borderColor="$background1"
      position="relative"
      overflow="hidden"
    >
      <View backgroundColor="$background1">
        <ModalHeader
          transparent
          relative
          headerTitle={title}
          onClose={onClose}
        />

        {!!options?.length && searchable && (
          <View
            paddingHorizontal={defaultPageHorizontalPadding}
            paddingBottom={defaultPageVerticalPadding / 2}
          >
            <Search
              value={searchValue}
              disabled={disabled}
              debounce={searchDebounce}
              placeholder={searchPlaceholder}
              inputFieldProps={{ backgroundColor: '$background' }}
              onChange={search}
              onPress={emitHaptic}
            />
          </View>
        )}
      </View>

      <AnimatedList
        ignoreAnimation
        listRef={flatListRef}
        data={adjustedOptions}
        renderItem={renderItem}
        showsVerticalScrollIndicator={isWeb}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: defaultPageVerticalPadding / 2,
          paddingBottom: isBigScreen
            ? defaultPageVerticalPadding
            : keyboardHeight,
        }}
        // onScrollBeginDrag, onScrollEndDrag and onScrollAnimationEnd added due to issue with modal on IOS.
        // should be removed with onTouchEnd
        onScrollBeginDrag={() => (scrollingRef.current = true)}
        onScrollEndDrag={() => (scrollingRef.current = false)}
        onScrollAnimationEnd={() => (scrollingRef.current = false)}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
};
