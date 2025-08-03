import { useCallback, useMemo, useRef } from 'react';
import { InputFieldView } from '../view/input-field-view';
import { FormField } from './form-field';
import { countries, ICountry, TCountryCode } from 'countries-list';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { MediumText, RegularText } from '../text/text';
import { headerHeight, useScreenHeaderHeight } from '../navigation/header';
import { Popover, View, XStack } from 'tamagui';
import { AnimatedList } from '../list/animated-list';
import { Icon } from '../icons';
import { AdaptivePopover } from '../popover/adaptive-popover';
import { FlatList, useWindowDimensions } from 'react-native';
import { useT } from '@symbiot-core-apps/i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScreenSize } from '@symbiot-core-apps/shared';

const getCountryEmoji = (code: TCountryCode) => {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map(
      (char) => 0x1f1e6 + char.charCodeAt(0) - 'A'.charCodeAt(0),
    ),
  );
};

export const CountryPicker = ({
  value,
  label,
  error,
  placeholder,
  disabled,
  onChange,
}: {
  value?: TCountryCode;
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

  const selectedCountry = useMemo(
    () => (value ? countries[value as TCountryCode]?.native : ''),
    [value],
  );

  const data = useMemo(
    () =>
      Object.keys(countries)
        .map((code) => ({
          code: code as TCountryCode,
          value: countries[code as TCountryCode],
        }))
        .sort((a, b) => (a.code === value ? -1 : b.code === value ? 1 : 0)),
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
    ({ item }: { item: { code: TCountryCode; value: ICountry } }) => (
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
          onChange(item.code);
          onClose();
        }}
      >
        <RegularText fontSize={34} lineHeight={34}>
          {getCountryEmoji(item.code)}
        </RegularText>

        <View flex={1}>
          <RegularText flex={1} numberOfLines={1}>
            {item.value.native}
          </RegularText>

          <MediumText
            fontSize={10}
            flex={1}
            numberOfLines={1}
            color="$placeholderColor"
          >
            {item.value.name}
          </MediumText>
        </View>

        {value === item.code && (
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
        sheetTitle={t('country')}
        triggerType="child"
        trigger={
          <InputFieldView disabled={disabled} onPress={onPress}>
            <RegularText
              flex={1}
              color={
                disabled ? '$disabled' : !value ? '$placeholderColor' : '$color'
              }
            >
              {selectedCountry || placeholder}
            </RegularText>
          </InputFieldView>
        }
        onClose={onClose}
      >
        <AnimatedList
          ignoreAnimation
          listRef={listRef}
          keyExtractor={(item) => item.code}
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
