import { Platform, Pressable, StyleSheet } from 'react-native';
import { View, ViewProps, XStack } from 'tamagui';
import {
  NativeStackHeaderProps,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Blur } from '../blur/blur';
import { memo, ReactElement, useCallback, useMemo } from 'react';
import { H4 } from '../text/heading';
import { ContainerView } from '../view/container-view';
import { Icon } from '../icons';
import { IconName } from '../icons/config';

export const headerHeight = 50;
export const headerButtonSize = 24;
export const headerHorizontalPadding = 14;

export const useScreenHeaderHeight = () => {
  const { top } = useSafeAreaInsets();

  return useMemo(() => top + headerHeight, [top]);
};

export const useScreenHeaderOptions = () => {
  const { top, left, right } = useSafeAreaInsets();

  const header = useCallback(
    (props: NativeStackHeaderProps) => (
      <ScreenHeader {...props} top={top} left={left} right={right} />
    ),
    [left, right, top],
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
    animation: 'slide_from_right',
  } as NativeStackNavigationOptions;
};

const SideElement = memo((props: ViewProps) => (
  <View
    zIndex={1}
    minWidth={headerButtonSize}
    height={headerButtonSize}
    justifyContent="center"
    alignItems="center"
    {...props}
  />
));

export const HeaderButton = ({
  iconName,
  onPress,
}: {
  iconName: IconName;
  onPress?: () => void;
}) => (
  <Pressable
    style={({ pressed }) => ({
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: pressed ? 0.8 : 1,
      outlineWidth: 0,
    })}
    onPress={onPress}
  >
    <Icon name={iconName} color="$buttonTextColor1" size={24} />
  </Pressable>
);

export const ScreenHeader = memo(
  ({
    back,
    navigation,
    top,
    left,
    right,
    options,
  }: NativeStackHeaderProps & {
    top: number;
    left: number;
    right: number;
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
      >
        {Platform.OS !== 'android' && (
          <Blur style={StyleSheet.absoluteFillObject} />
        )}

        <ContainerView
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
                      iconName="ArrowLeft"
                      onPress={navigation.goBack}
                    />
                  )
            }
          />

          {typeof options.headerTitle === 'string' && (
            <H4 zIndex={1}>{options.headerTitle}</H4>
          )}

          {typeof options.headerTitle === 'function' &&
            options.headerTitle({ children: '' })}

          <SideElement children={options.headerRight?.({})} />
        </ContainerView>
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
    const { left, right } = useSafeAreaInsets();
    const screenHeaderHeight = useScreenHeaderHeight();

    return (
      <XStack
        zIndex={1}
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height={height || screenHeaderHeight}
        paddingLeft={left + headerHorizontalPadding}
        paddingRight={right + headerHorizontalPadding}
      >
        {Platform.OS !== 'android' && (
          <Blur style={StyleSheet.absoluteFillObject} />
        )}

        <ContainerView
          gap="$5"
          flexDirection="row"
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
        </ContainerView>
      </XStack>
    );
  },
);
