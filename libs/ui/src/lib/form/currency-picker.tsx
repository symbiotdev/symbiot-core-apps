import { useCallback, useMemo, useRef } from 'react';
import { InputFieldView } from '../view/input-field-view';
import { FormField } from './form-field';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { RegularText } from '../text/text';
import { headerHeight, useScreenHeaderHeight } from '../navigation/header';
import { Popover, XStack } from 'tamagui';
import { AnimatedList } from '../list/animated-list';
import { Icon } from '../icons';
import { AdaptivePopover } from '../popover/adaptive-popover';
import { FlatList, useWindowDimensions } from 'react-native';
import { useT } from '@symbiot-core-apps/i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { currencySymbol, useScreenSize } from '@symbiot-core-apps/shared';

export const CurrencyPicker = ({
  value,
  label,
  error,
  placeholder,
  disabled,
  onChange,
}: {
  value?: string;
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (code: string) => void;
}) => {
  const { t } = useT();
  const { isSmall } = useScreenSize();
  const { bottom } = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const screenHeaderHeight = useScreenHeaderHeight();

  const popoverRef = useRef<Popover>(null);
  const listRef = useRef<FlatList>(null);

  const data = useMemo(
    () =>
      Array.from([
        ...new Set(
          Object.keys(currencySymbol).sort((a, b) =>
            a === value ? -1 : b === value ? 1 : 0,
          ),
        ),
      ]),
    [value],
  );

  const onPress = useCallback(() => impactAsync(ImpactFeedbackStyle.Light), []);

  const onClose = useCallback(() => {
    void impactAsync(ImpactFeedbackStyle.Light);
    popoverRef.current?.close();

    setTimeout(() =>
      listRef.current?.scrollToOffset({
        animated: false,
        offset: 0,
      }),
    );
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <XStack
        width="100%"
        cursor={!disabled ? 'pointer' : 'default'}
        disabled={disabled}
        pressStyle={{ opacity: 0.8 }}
        paddingVertical="$3"
        paddingHorizontal="$4"
        alignItems="center"
        gap="$2"
        onPress={() => {
          onChange(item);
          onClose();
        }}
      >
        <RegularText numberOfLines={1} flex={1}>
          {item} · {currencySymbol[item]}
        </RegularText>

        {value === item && (
          <Icon
            name="Unread"
            color={disabled ? '$disabled' : '$checkboxColor'}
          />
        )}
      </XStack>
    ),
    [disabled, onChange, onClose, value],
  );

  return (
    <FormField label={label} error={error}>
      <AdaptivePopover
        ignoreScroll
        disableDrag
        type="closable"
        ref={popoverRef}
        disabled={disabled}
        minWidth={200}
        sheetTitle={t('currency')}
        triggerType="child"
        trigger={
          <InputFieldView disabled={disabled} onPress={onPress}>
            <RegularText
              flex={1}
              color={
                disabled ? '$disabled' : !value ? '$placeholderColor' : '$color'
              }
            >
              {value ? `${value} · ${currencySymbol[value]}` : placeholder}
            </RegularText>
          </InputFieldView>
        }
      >
        <AnimatedList
          ignoreAnimation
          listRef={listRef}
          keyExtractor={(item) => item}
          data={data}
          style={{
            height: Math.min(height - screenHeaderHeight - 100, 512),
            minWidth: Math.min(width, 400),
          }}
          contentContainerStyle={{
            paddingTop: isSmall ? headerHeight : 0,
            paddingBottom: bottom,
          }}
          renderItem={renderItem}
        />
      </AdaptivePopover>
    </FormField>
  );
};
