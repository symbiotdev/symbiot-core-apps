import {
  AdaptiveSheet,
  EmptyView,
  FallbackView,
  PAGE_STYLE,
  ToggleList,
  ToggleListProps,
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
import { emitHaptic, useI18n } from '@symbiot-core-apps/shared';
import { FlatList } from 'react-native';

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
  searchable,
  optionsError,
  searchDebounce,
  optionsLoading,
  noSelectedValue,
  searchPlaceholder,
  showSelectedDescription,
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
}) => {
  const { t } = useI18n();

  const areOptionsLoading = !options && optionsLoading;

  const listRef = useRef<FlatList>(null);

  const [searchValue, setSearchValue] = useState('');

  const adjustedOptions = useMemo(
    () =>
      options?.filter(
        (option) =>
          option.label
            .toLowerCase()
            .replace(/[^\p{L}\p{N}]/gu, '')
            .indexOf(
              searchValue.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ''),
            ) !== -1,
      ),
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

  return (
    <AdaptiveSheet
      excludePaddings
      sheetTitle={optionsLabel}
      popoverPlacement="bottom-start"
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
        options={adjustedOptions}
        contentContainerStyle={{
          paddingVertical: PAGE_STYLE.paddingVertical / 2,
          paddingHorizontal: PAGE_STYLE.paddingHorizontal,
        }}
        optionsLoading={optionsLoading}
        ListEmptyComponent={ListEmptyComponent}
        {...toggleListProps}
      />

      {!!searchable && (
        <Search
          value={searchValue}
          disabled={disabled}
          debounce={searchDebounce}
          placeholder={searchPlaceholder}
          inputFieldProps={{
            backgroundColor: '$background',
            marginHorizontal: PAGE_STYLE.paddingHorizontal,
            marginBottom: PAGE_STYLE.paddingVertical,
          }}
          onChange={search}
          onPress={emitHaptic}
        />
      )}
    </AdaptiveSheet>
  );
};
