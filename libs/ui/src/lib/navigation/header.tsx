import { Platform, Pressable } from 'react-native';
import { useTheme, View, ViewProps, XStack } from 'tamagui';
import {
  NativeStackHeaderProps,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BaseSyntheticEvent,
  memo,
  ReactElement,
  useCallback,
  useMemo,
} from 'react';
import { H4 } from '../text/heading';
import { Icon } from '../icons';
import { IconName } from '../icons/config';
import { emitHaptic, isTablet } from '@symbiot-core-apps/shared';
import { AttentionView } from '../view/attention-view';
import { NavigationBackground } from './background';
import { MediumText } from '../text/text';

export const headerHeight = 50;
export const headerButtonSize = 24;
export const headerHorizontalPadding = 14;
export const headerBackButtonIconName = 'ArrowLeft';

export const useScreenHeaderHeight = () => {
  const { top } = useSafeAreaInsets();

  return useMemo(() => top + headerHeight, [top]);
};

export const useScreenHeaderOptions = () => {
  const { top, left, right } = useSafeAreaInsets();
  const theme = useTheme();

  const header = useCallback(
    (props: NativeStackHeaderProps) => (
      <ScreenHeader
        {...props}
        top={top}
        left={left}
        right={right}
        borderBottomColor={theme.background?.val}
      />
    ),
    [left, right, theme.background?.val, top],
  );

  return {
    header,
    headerTransparent: true,
  };
};

export const useStackScreenHeaderOptions = () => {
  const headerOptions = useScreenHeaderOptions();

  return {
    ...headerOptions,
    ...(Platform.OS === 'android' && {
      animation: 'ios_from_right',
    }),
  } as NativeStackNavigationOptions;
};

const SideElement = memo((props: ViewProps) => (
  <View
    zIndex={1}
    width={60}
    minWidth={60}
    height={headerButtonSize}
    justifyContent="center"
    {...props}
  />
));

export const HeaderButton = memo(
  ({
    attention,
    iconName,
    onPress,
  }: {
    iconName: IconName;
    attention?: boolean;
    onPress?: (e: BaseSyntheticEvent) => void;
  }) => (
    <AttentionView attention={Boolean(attention)}>
      <Pressable
        style={({ pressed }) => ({
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: pressed ? 0.8 : 1,
          outlineWidth: 0,
        })}
        onPress={(e) => {
          onPress?.(e);
          emitHaptic();
        }}
      >
        <Icon name={iconName} color="$buttonTextColor1" />
      </Pressable>
    </AttentionView>
  ),
);

export const ScreenHeader = memo(
  ({
    back,
    navigation,
    top,
    left,
    right,
    options,
    borderBottomColor,
  }: NativeStackHeaderProps & {
    top: number;
    left: number;
    right: number;
    borderBottomColor?: string;
  }) => {
    const withContent =
      !!options.headerLeft ||
      !!back ||
      !!options.headerRight ||
      typeof options.headerTitle === 'string' ||
      typeof options.headerTitle === 'function';

    return (
      <XStack
        flex={1}
        gap="$2"
        position="relative"
        justifyContent="space-between"
        alignItems="center"
        paddingTop={top}
        paddingLeft={left + headerHorizontalPadding}
        paddingRight={right + headerHorizontalPadding}
        height={top + (withContent ? headerHeight : 0)}
        borderBottomWidth={1}
        borderBottomColor={borderBottomColor}
      >
        <NavigationBackground />

        <SideElement
          flex={1}
          alignItems="flex-start"
          children={
            typeof options.headerLeft === 'function'
              ? options.headerLeft({})
              : !!back && (
                  <HeaderButton
                    iconName={headerBackButtonIconName}
                    onPress={navigation.goBack}
                  />
                )
          }
        />

        {typeof options.headerTitle === 'string' && (
          <MediumText
            flex={4}
            zIndex={1}
            numberOfLines={2}
            textAlign="center"
            lineHeight={headerButtonSize}
          >
            {options.headerTitle}
          </MediumText>
        )}

        {typeof options.headerTitle === 'function' && (
          <View flex={4} alignItems="center">
            {options.headerTitle({ children: '' })}
          </View>
        )}

        <SideElement
          flex={options.headerTitle ? 1 : undefined}
          alignItems="flex-end"
          children={options.headerRight?.({})}
        />
      </XStack>
    );
  },
);

export const ModalHeader = memo(
  ({
    height,
    headerLeft,
    headerTitle,
    headerRight,
    onClose,
  }: {
    height?: number;
    headerLeft?: () => ReactElement;
    headerTitle?: string | (() => ReactElement);
    headerRight?: () => ReactElement;
    onClose?: (e: BaseSyntheticEvent) => void;
  }) => {
    const { top, left, right } = useSafeAreaInsets();
    const theme = useTheme();

    const adjustedTop = useMemo(() => (isTablet ? top : 0), [top]);

    return (
      <XStack
        zIndex={1}
        position="absolute"
        top={0}
        flex={1}
        left={0}
        right={0}
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        gap="$2"
        paddingTop={adjustedTop}
        height={adjustedTop + (height || headerHeight)}
        paddingLeft={left + headerHorizontalPadding}
        paddingRight={right + headerHorizontalPadding}
        borderBottomWidth={1}
        borderBottomColor={theme.background1?.val}
      >
        <NavigationBackground />

        <SideElement
          flex={1}
          alignItems="flex-start"
          children={headerLeft?.()}
        />

        {typeof headerTitle === 'string' && (
          <H4 flex={4} textAlign="center" zIndex={1}>
            {headerTitle}
          </H4>
        )}

        {typeof headerTitle === 'function' && (
          <View flex={4} alignItems="center">
            {headerTitle()}
          </View>
        )}

        <SideElement
          flex={headerTitle ? 1 : undefined}
          alignItems="flex-end"
          children={
            typeof headerRight === 'function' ? (
              headerRight()
            ) : (
              <HeaderButton iconName="Close" onPress={onClose} />
            )
          }
        />
      </XStack>
    );
  },
);
