import { Pressable } from 'react-native';
import { useTheme, View, ViewProps, XStack } from 'tamagui';
import {
  NativeStackHeaderProps,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { memo, ReactElement, useCallback, useMemo } from 'react';
import { H4 } from '../text/heading';
import { Icon } from '../icons';
import { IconName } from '../icons/config';
import { emitHaptic, isTablet } from '@symbiot-core-apps/shared';
import { AttentionView } from '../view/attention-view';
import { NavigationBackground } from './background';

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
        borderBottomColor={theme.background1?.val}
      />
    ),
    [left, right, theme.background1?.val, top],
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
    animation: 'ios_from_right',
  } as NativeStackNavigationOptions;
};

const SideElement = memo((props: ViewProps) => (
  <View
    zIndex={1}
    maxWidth="80%"
    minWidth={headerButtonSize}
    height={headerButtonSize}
    justifyContent="center"
    alignItems="center"
    {...props}
  />
));

export const HeaderButton = memo(
  ({
    attention,
    iconName,
    onPress,
  }: {
    attention?: boolean;
    iconName: IconName;
    onPress?: () => void;
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
        onPress={() => {
          onPress?.();
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
        position="relative"
        paddingTop={top}
        paddingLeft={left + headerHorizontalPadding}
        paddingRight={right + headerHorizontalPadding}
        height={top + (withContent ? headerHeight : 0)}
        borderBottomWidth={1}
        borderBottomColor={borderBottomColor}
      >
        <NavigationBackground />

        <XStack
          flex={1}
          gap="$5"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <SideElement
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
            <H4 zIndex={1} lineHeight={headerButtonSize}>
              {options.headerTitle}
            </H4>
          )}

          {typeof options.headerTitle === 'function' &&
            options.headerTitle({ children: '' })}

          <SideElement children={options.headerRight?.({})} />
        </XStack>
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
    onClose?: () => void;
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
        paddingTop={adjustedTop}
        height={adjustedTop + (height || headerHeight)}
        paddingLeft={left + headerHorizontalPadding}
        paddingRight={right + headerHorizontalPadding}
        borderBottomWidth={1}
        borderBottomColor={theme.background1?.val}
      >
        <NavigationBackground />

        <XStack
          gap="$5"
          width="100%"
          alignItems="center"
          justifyContent="space-between"
          marginTop="auto"
          height={headerHeight}
        >
          <SideElement children={headerLeft?.()} />

          {typeof headerTitle === 'string' && <H4 zIndex={1}>{headerTitle}</H4>}

          {typeof headerTitle === 'function' && headerTitle()}

          <SideElement
            children={
              typeof headerRight === 'function' ? (
                headerRight()
              ) : (
                <HeaderButton iconName="CloseCircle" onPress={onClose} />
              )
            }
          />
        </XStack>
      </XStack>
    );
  },
);
