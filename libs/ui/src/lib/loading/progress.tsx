import { useTheme, View, ViewProps } from 'tamagui';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

export const Progress = ({
  value,
  ...viewProps
}: ViewProps & { value: number }) => {
  const theme = useTheme();
  const widthPercent$ = useSharedValue(value || 0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${widthPercent$.value}%`,
    };
  }, []);

  useEffect(() => {
    widthPercent$.value = withTiming(value, { duration: 300 });
  }, [value]);

  return (
    <View
      borderRadius="$10"
      backgroundColor="$background1"
      height="$1"
      flex={1}
      overflow="hidden"
      {...viewProps}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            borderRadius: 100,
            backgroundColor: theme.buttonBackground?.val,
            height: '100%',
          },
        ]}
      />
    </View>
  );
};
