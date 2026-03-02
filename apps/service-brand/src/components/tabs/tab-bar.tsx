import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ReactElement } from 'react';
import { useTheme, View } from 'tamagui';
import { emitHaptic, eventEmitter } from '@symbiot-core-apps/shared';
import Animated, {
  Easing,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { GlassView } from '@symbiot-core-apps/ui2';

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
    [hidden],
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
          bottom: insets.bottom + 10,
        },
      ]}
    >
      <GlassView
        interactive
        style={{
          position: 'relative',
          alignItems: 'center',
          flexDirection: 'row',
          borderRadius: 25,
          paddingHorizontal: 5,
        }}
      >
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
      </GlassView>

      {DynamicButton}
    </Animated.View>
  );
};
