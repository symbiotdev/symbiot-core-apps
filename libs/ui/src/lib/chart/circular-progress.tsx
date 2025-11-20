import React from 'react';
import { useTheme, View, ViewProps, YStack } from 'tamagui';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Circle } from 'react-native-svg';
import { MediumText, RegularText } from '../text/text';

export const CircularProgress = ({
  progress,
  radius = 50,
  title,
  subtitle,
  titleFontSize,
  subtitleFontSize,
  angle,
  delay,
  ...viewProps
}: ViewProps & {
  progress: number;
  radius?: number;
  title?: string;
  subtitle?: string;
  titleFontSize?: number | string;
  angle?: number;
  subtitleFontSize?: number | string;
  delay?: number;
}) => {
  const theme = useTheme();

  const arcSweepAngle = angle || 360;

  return (
    <View {...viewProps}>
      <AnimatedCircularProgress
        size={radius}
        rotation={angle ? -(arcSweepAngle / 2) : 0}
        arcSweepAngle={arcSweepAngle}
        width={radius / 10}
        fill={progress}
        tintColor={theme?.color?.val}
        backgroundColor="#EEEEEE50"
        delay={delay}
        renderCap={({ center }) => (
          <Circle
            cx={center.x}
            cy={center.y}
            r={radius / 20}
            fill={theme?.color?.val}
          />
        )}
      >
        {() => (
          <YStack alignItems="center" gap={3} paddingHorizontal={5}>
            {!!title && (
              <MediumText
                fontSize={titleFontSize || radius / 8}
                textAlign="center"
                numberOfLines={2}
              >
                {title}
              </MediumText>
            )}

            {!!subtitle && (
              <RegularText
                fontSize={subtitleFontSize || radius / 10}
                textAlign="center"
                color="$gray9"
                numberOfLines={3}
              >
                {subtitle}
              </RegularText>
            )}
          </YStack>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};
