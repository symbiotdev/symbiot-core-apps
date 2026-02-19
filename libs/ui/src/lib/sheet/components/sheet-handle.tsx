import React from 'react';
import { Pressable, View } from 'react-native';
import { GestureDetector, GestureType } from 'react-native-gesture-handler';

export const SheetHandle = ({
  ignorePanGesture,
  panGesture,
  onPress,
}: {
  ignorePanGesture: boolean;
  panGesture: GestureType;
  onPress: () => void;
}) =>
  ignorePanGesture ? (
    <GestureDetector gesture={panGesture}>
      <Container onPress={onPress} />
    </GestureDetector>
  ) : (
    <Container onPress={onPress} />
  );

const Container = ({ onPress }: { onPress: () => void }) => (
  <Pressable
    style={{
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: 24,
      top: 0,
      left: 0,
      right: 0,
      zIndex: 2,
    }}
    onPressIn={onPress}
  >
    <View
      style={{
        width: 50,
        height: 4,
        backgroundColor: '#77777750',
      }}
    />
  </Pressable>
);
