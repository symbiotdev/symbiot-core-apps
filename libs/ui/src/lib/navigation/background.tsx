import { StyleSheet, View, ViewStyle } from 'react-native';
import { isCustomDesignMandatory } from '@symbiot-core-apps/theme';
import { GlassView } from 'expo-glass-effect';
import { BaseSyntheticEvent } from 'react';
import { BlurView as ExpoBlurView } from 'expo-blur';
import { useAppScheme } from '@symbiot-core-apps/state';
import { isIos } from '@symbiot-core-apps/shared';

export const NavigationBackground = ({
  custom,
  blurIntensity,
  blurStyle,
  style,
  onPress,
}: {
  custom?: boolean;
  blurIntensity?: number;
  blurStyle?: ViewStyle;
  style?: ViewStyle;
  onPress?: (e: BaseSyntheticEvent) => void;
}) => {
  const { scheme } = useAppScheme();

  return custom || isCustomDesignMandatory ? (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          overflow: 'hidden',
          ...(!isIos && {
            backgroundColor: scheme === 'light' ? '#FAFAFA' : '#111111',
            opacity: 0.9,
          }),
        },
        style,
      ]}
      onTouchStart={onPress}
      onPointerDown={onPress}
    >
      <ExpoBlurView
        tint={scheme}
        intensity={blurIntensity}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          ...blurStyle,
        }}
      />
    </View>
  ) : (
    <GlassView colorScheme={scheme} style={[StyleSheet.absoluteFill, style]} />
  );
};
