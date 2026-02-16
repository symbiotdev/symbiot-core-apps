import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ReactElement } from 'react';
import { useTheme, View } from 'tamagui';
import { emitHaptic, eventEmitter } from '@symbiot-core-apps/shared';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { NavigationBackground } from '@symbiot-core-apps/ui';
import { isCustomDesignMandatory } from '@symbiot-core-apps/theme';
import { useAppScheme } from '@symbiot-core-apps/state';

export const CustomTabBar = ({
  hidden,
  insets,
  DynamicButton,
  state,
  navigation,
  descriptors,
}: BottomTabBarProps & {
  hidden?: boolean;
  DynamicButton?: ReactElement;
}) => {
  const theme = useTheme();
  const { scheme } = useAppScheme();
  const pressed = useSharedValue(false);

  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: withDelay(
            hidden ? 200 : 0,
            withTiming(hidden ? 250 : 0, {
              duration: 250,
              easing: Easing.inOut(Easing.ease),
            }),
          ),
        },
      ],
    }),
    [hidden, pressed],
  );

  const mainTabsAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: withTiming(pressed.value ? 1.05 : 1, {
            duration: 150,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
    }),
    [],
  );

  return (
    <Animated.View
      style={[
        containerAnimatedStyle,
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'absolute',
          width: '100%',
          gap: 10,
          paddingLeft: insets.left + 20,
          paddingRight: insets.right + 20,
          bottom: insets.bottom + (insets.bottom ? 0 : 20),
        },
      ]}
    >
      <Animated.View
        style={[
          mainTabsAnimatedStyle,
          {
            position: 'relative',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 5,
          },
        ]}
      >
        <NavigationBackground
          style={{
            overflow: 'hidden',
            borderRadius: 25,
            boxShadow: '0 0 25px rgba(0, 0, 0, 0.15)',
            ...(isCustomDesignMandatory && {
              borderWidth: 1,
              borderColor: '#FFFFFF20',
            }),
          }}
        />

        {Object.values(descriptors).map(({ route, options }, index) => {
          const focused = index === state.index;

          return (
            <View
              key={route.key}
              height={55}
              width={55}
              cursor="pointer"
              justifyContent="center"
              alignItems="center"
              onPressIn={() => pressed.set(true)}
              onPressOut={() => pressed.set(false)}
              onPress={() => {
                emitHaptic();
                eventEmitter.emit('tabPress', route.name);
                navigation.navigate(route.name);
              }}
            >
              {options.tabBarIcon?.({
                focused,
                size: 24,
                color: theme.color?.val,
              })}
            </View>
          );
        })}
      </Animated.View>

      {DynamicButton}
    </Animated.View>
  );
};
