import {
  AdaptiveSheet,
  AdaptiveSheetRef,
  EmptyView,
  FallbackView,
  PAGE_STYLE,
  ToggleList,
  ToggleListProps,
  ToggleListValue,
} from '@symbiot-core-apps/ui2';
import React, {
  ReactElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { InputFieldView } from '../wrapper/input-field-view';
import { LightText, Spinner } from '@symbiot-core-apps/ui';
import { FormField } from '../wrapper/form-field';
import { Search } from './search';
import { emitHaptic, useI18n, useInsets } from '@symbiot-core-apps/shared';
import { FlatList } from 'react-native';
import { View } from 'tamagui';

export const Select = ({
  value,
  label,
  optionsLabel,
  error,
  disabled,
  loading,
  required,
  trigger,
  options,
  placeholder,
  multiselect,
  searchable,
  optionsError,
  searchDebounce,
  optionsLoading,
  noSelectedValue,
  searchPlaceholder,
  showSelectedDescription,
  onBlur,
  onChange,
  ...toggleListProps
}: Omit<ToggleListProps, 'ListEmptyComponent'> & {
  label?: string;
  optionsLabel?: string;
  error?: string;
  loading?: boolean;
  required?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  searchDebounce?: number;
  searchPlaceholder?: string;
  placeholder?: string;
  trigger?: ReactElement;
  noSelectedValue?: string;
  showSelectedDescription?: boolean;
  onBlur?: () => void;
}) => {
  const { t } = useI18n();
  const { bottom } = useInsets();

  const listRef = useRef<FlatList>(null);
  const sheetRef = useRef<AdaptiveSheetRef>(null);

  const [searchValue, setSearchValue] = useState('');

  const adjustedOptions = useMemo(
    () =>
      options?.filter((option) => {
        const isExist = (text: string) =>
          text
            .toLowerCase()
            .replace(/[^\p{L}\p{N}]/gu, '')
            .indexOf(
              searchValue.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ''),
            ) !== -1;

        if (isExist(option.label)) return true;
        else if (option.description) return isExist(option.description);
        else return false;
      }),
    [options, searchValue],
  );

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

  const search = useCallback((text: string) => {
    setSearchValue(text);

    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, []);

  const ListEmptyComponent = useCallback(
    () =>
      !options && !searchValue ? (
        <FallbackView loading={optionsLoading} error={optionsError} />
      ) : (
        <EmptyView iconName="Magnifer" message={t('shared.nothing_found')} />
      ),
    [options, optionsError, optionsLoading, searchValue, t],
  );

  const _onChange = useCallback(
    (value: ToggleListValue) => {
      onChange?.(value);
      if (!multiselect) sheetRef.current?.hide?.();
    },
    [multiselect, onChange],
  );

  const onClose = useCallback(() => {
    onBlur?.();
    setSearchValue('');
  }, [onBlur]);

  const areOptionsLoading = !options && optionsLoading;

  return (
    <AdaptiveSheet
      excludePaddings
      ref={sheetRef}
      sheetTitle={optionsLabel || label}
      popoverPlacement="bottom-start"
      onClose={onClose}
      trigger={
        <FormField
          required={required}
          label={label}
          error={error}
          description={description}
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
        </FormField>
      }
    >
      <ToggleList
        ignoreAnimation
        value={value}
        listRef={listRef}
        multiselect={multiselect}
        options={adjustedOptions}
        singleSelectHaptic={false}
        contentContainerStyle={{
          paddingBottom: PAGE_STYLE.paddingVertical / 2 + (searchable ? 50 : 0),
          paddingHorizontal: PAGE_STYLE.paddingHorizontal,
        }}
        optionsLoading={optionsLoading}
        ListEmptyComponent={ListEmptyComponent}
        onChange={_onChange}
        {...toggleListProps}
      />

      {!!searchable && (
        <View
          style={{
            position: 'absolute',
            left: PAGE_STYLE.paddingHorizontal,
            right: PAGE_STYLE.paddingHorizontal,
            bottom: bottom + 10,
          }}
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
    </AdaptiveSheet>
  );
};
