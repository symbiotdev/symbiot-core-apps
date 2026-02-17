import { Pressable, ViewStyle } from 'react-native';
import { View, XStack } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BaseSyntheticEvent,
  memo,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useMemo,
} from 'react';
import { Icon, IconName } from '../icons';
import {
  emitHaptic,
  isAndroid,
  isIos,
  isWeb,
  SystemScheme,
} from '@symbiot-core-apps/shared';
import { AttentionView } from '../view/attention-view';
import { MediumText, RegularText } from '../text/text';
import {
  NativeStackHeaderProps,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { useAppScheme } from '@symbiot-core-apps/state';
import { GlassView } from '../view/glass-view';

export const headerHeight = 50;
export const headerButtonSize = 24;
export const headerHorizontalPadding = 14;
export const headerBackButtonIconName = 'ArrowLeft';

export const useScreenHeaderHeight = () => {
  const { top } = useSafeAreaInsets();

  return useMemo(() => top + headerHeight, [top]);
};

export const useScreenHeaderOptions = () => {
  const { scheme } = useAppScheme();
  const { top, left, right } = useSafeAreaInsets();

  return {
    headerTransparent: true,
    header: useCallback(
      (props: NativeStackHeaderProps) => (
        <ScreenHeader
          {...props}
          top={top}
          left={left}
          right={right}
          scheme={scheme}
        />
      ),
      [left, right, top, scheme],
    ),
  } as NativeStackNavigationOptions;
};

export const useStackScreenHeaderOptions = () => {
  const headerOptions = useScreenHeaderOptions();

  return {
    ...headerOptions,
    ...(isAndroid && {
      animation: 'slide_from_right',
    }),
  } as NativeStackNavigationOptions;
};

const SideElement = memo(
  ({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) =>
    children ? (
      <GlassView
        interactive
        children={children}
        style={{
          ...style,
          zIndex: 1,
          minHeight: 40,
          minWidth: 40,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 20,
        }}
      />
    ) : (
      <View width={40} />
    ),
);

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
    <AttentionView
      width="100%"
      height={40}
      justifyContent="center"
      alignItems="center"
      attention={Boolean(attention)}
    >
      <Pressable
        style={({ pressed }) => ({
          width: '100%',
          height: '100%',
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

export const HeaderTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <>
    <MediumText numberOfLines={subtitle ? 1 : 2} textAlign="center">
      {title}
    </MediumText>

    {!!subtitle && (
      <RegularText
        color="$disabled"
        textAlign="center"
        numberOfLines={1}
        fontSize={12}
      >
        {subtitle}
      </RegularText>
    )}
  </>
);

const shadowSize = isAndroid ? 25 : 50;

export const ScreenHeader = memo(
  ({
    back,
    navigation,
    top,
    left,
    right,
    options,
    scheme,
  }: NativeStackHeaderProps & {
    top: number;
    left: number;
    right: number;
    scheme: SystemScheme;
  }) => {
    const withContent =
      !!options.headerLeft ||
      !!back ||
      !!options.headerRight ||
      typeof options.headerTitle === 'string' ||
      typeof options.headerTitle === 'function';

    return (
      <>
        {!isWeb && (
          <View
            position="absolute"
            top={-shadowSize * 2}
            left={-shadowSize}
            right={-shadowSize}
            height={shadowSize * 2}
            boxShadow={`0 ${shadowSize}px ${shadowSize}px ${scheme === 'dark' ? '#000000' : '#FFFFFF'}`}
          />
        )}

        <XStack
          gap="$2"
          position="relative"
          alignItems="center"
          justifyContent="space-between"
          zIndex={1}
          paddingTop={top}
          paddingLeft={left + headerHorizontalPadding}
          paddingRight={right + headerHorizontalPadding}
          height={top + (withContent ? headerHeight : 0)}
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

          {!!options.headerTitle && (
            <GlassView
              style={{
                zIndex: 1,
                borderRadius: 20,
                paddingVertical: 5,
                paddingHorizontal: 10,
                minHeight: 40,
                flexShrink: 1,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {typeof options.headerTitle === 'string' && (
                <HeaderTitle title={options.headerTitle} />
              )}

              {typeof options.headerTitle === 'function' &&
                options.headerTitle({ children: '' })}
            </GlassView>
          )}

          <SideElement children={options.headerRight?.({})} />
        </XStack>
      </>
    );
  },
);

export const ModalHeader = memo(
  ({
    height,
    headerLeft,
    relative,
    headerTitle,
    headerRight,
    onClose,
  }: {
    height?: number;
    relative?: boolean;
    headerLeft?: () => ReactElement;
    headerTitle?: string | (() => ReactElement);
    headerRight?: () => ReactElement;
    onClose?: (e: BaseSyntheticEvent) => void;
  }) => {
    const { top, left, right } = useSafeAreaInsets();

    const adjustedTop = useMemo(() => (isIos ? 5 : top), [top]);

    const adjustedHeight = adjustedTop + (height || headerHeight);

    return (
      <XStack
        zIndex={1}
        {...(!relative && {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        })}
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        gap="$2"
        paddingTop={adjustedTop}
        height={adjustedHeight}
        maxHeight={adjustedHeight}
        paddingLeft={left + headerHorizontalPadding}
        paddingRight={right + headerHorizontalPadding}
      >
        <SideElement children={headerLeft?.()} />

        {!!headerTitle && (
          <GlassView
            style={{
              zIndex: 1,
              borderRadius: 20,
              paddingVertical: 5,
              paddingHorizontal: 10,
              minHeight: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {typeof headerTitle === 'string' && (
              <HeaderTitle title={headerTitle} />
            )}

            {typeof headerTitle === 'function' && headerTitle()}
          </GlassView>
        )}

        <SideElement
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
