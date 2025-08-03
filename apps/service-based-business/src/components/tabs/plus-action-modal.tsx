import React, { useCallback, useRef, useState } from 'react';
import {
  GestureResponderEvent,
  LayoutRectangle,
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { AnimatePresence, ScrollView, View } from 'tamagui';
import { FormView, H2, Icon } from '@symbiot-core-apps/ui';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { useScreenOrientation } from '@symbiot-core-apps/shared';
import { Icons } from '../../icons/config';

export const PlusActionModal = (props: BottomTabBarButtonProps) => {
  const [state, setState] = useState<{
    modalVisible: boolean;
    rect?: LayoutRectangle;
  }>({
    modalVisible: false,
  });

  const openModal = useCallback((event: GestureResponderEvent) => {
    event.target.measure((x, y, width, height, pageX, pageY) => {
      setState((prev) => ({
        ...prev,
        modalVisible: true,
        rect: { x: pageX, y: pageY, width, height },
      }));

      void impactAsync(ImpactFeedbackStyle.Light);
    });
  }, []);

  const closeModal = useCallback(() => {
    void impactAsync(ImpactFeedbackStyle.Light);

    setState((prev) => ({
      ...prev,
      rect: undefined,
    }));

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        modalVisible: false,
      }));
    }, 250);
  }, []);

  return (
    <>
      <Pressable
        style={{ marginHorizontal: 'auto', marginTop: 4 }}
        onPress={openModal}
      >
        <Icon
          name={Icons.TabsPlus}
          type="SolarLinear"
          color="$borderColor"
          size={34}
        />
      </Pressable>

      <Modal
        transparent
        visible={state.modalVisible}
        statusBarTranslucent
        animationType="none"
        presentationStyle="overFullScreen"
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={closeModal}
      >
        <AnimatePresence>
          {state.rect && <Content rect={state.rect} onClose={closeModal} />}
        </AnimatePresence>
      </Modal>
    </>
  );
};

const Content = ({
  rect,
  onClose,
}: {
  rect: LayoutRectangle;
  onClose: () => void;
}) => {
  const { height, width } = useWindowDimensions();
  const rectRef = useRef(rect);

  const adjustedWidth = width * 2;
  const adjustedHeight = height + Math.min(height / 2, 200);

  useScreenOrientation({
    onBeforeChange: onClose,
  });

  return (
    <>
      <View
        animation="quick"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        opacity={0.8}
        style={StyleSheet.absoluteFillObject}
        backgroundColor="$background"
        onPress={onClose}
      />

      <View
        left={rectRef.current.x}
        top={rectRef.current.y}
        position="absolute"
        zIndex={1}
        onPress={onClose}
      >
        <Icon
          name={Icons.TabsPlus}
          type="SolarBold"
          color="$color"
          size={rectRef.current.width}
        />
      </View>

      <View
        top={
          rectRef.current.y + rectRef.current.height / 2 - adjustedHeight / 2
        }
        left={rectRef.current.x + rectRef.current.width / 2 - adjustedWidth}
        position="absolute"
        backgroundColor="$background1"
        borderRadius="50%"
        width={adjustedWidth * 2}
        height={adjustedHeight}
        scale={1}
        opacity={1}
        animation="quickest"
        enterStyle={{ scale: 0, opacity: 0 }}
        exitStyle={{ scale: 0, opacity: 0 }}
      >
        <FormView
          paddingTop={40}
          height={adjustedHeight / 2 - rectRef.current.height / 2}
          alignSelf="center"
          maxWidth={Math.min(600, width) - 40}
        >
          <ScrollView>
            <H2>Brands</H2>
          </ScrollView>
        </FormView>
      </View>
    </>
  );
};
