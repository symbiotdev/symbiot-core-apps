import { forwardRef, ReactElement, Ref, useCallback, useState } from 'react';
import {
  GestureResponderEvent,
  LayoutRectangle,
  Modal,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  AnimatePresence,
  ColorTokens,
  TamaguiElement,
  View,
  ViewProps,
} from 'tamagui';
import { Icon } from '../icons/icon';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import {
  flip,
  offset,
  Placement,
  shift,
  useFloating,
} from '@floating-ui/react-native';
import { Card } from '../card/card';
import { Blur } from '../blur/blur';
import { Spinner } from '../loading/spinner';
import { ListItem } from '../list/list-item';
import { useScreenOrientation } from '@symbiot-core-apps/shared';

export type ContextMenuItem = {
  label: string;
  icon?: false | ReactElement<{ color?: string; size?: number }>;
  iconSize?: number;
  color?: ColorTokens;
  onPress: () => void;
};

const menuCloseDelay = 150;

export const ContextMenuPopover = ({
  items,
  disabled,
  loading,
}: {
  items: ContextMenuItem[];
  disabled?: boolean;
  loading?: boolean;
}) => {
  const [state, setState] = useState<{
    modalVisible: boolean;
    menuVisible: boolean;
    rect?: LayoutRectangle;
  }>({
    modalVisible: false,
    menuVisible: false,
  });

  const openMenu = useCallback((event: GestureResponderEvent) => {
    event.target.measure((x, y, width, height, pageX, pageY) => {
      setState((prev) => ({
        ...prev,
        modalVisible: true,
        menuVisible: true,
        rect: { x: pageX - x, y: pageY - y, width, height },
      }));

      void impactAsync(ImpactFeedbackStyle.Light);
    });
  }, []);
  const closeMenu = useCallback(() => {
    setState((prev) => ({
      ...prev,
      menuVisible: false,
    }));

    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        modalVisible: false,
      }));
    }, menuCloseDelay);
  }, []);

  return (
    <>
      <Trigger
        loading={loading}
        disabled={disabled || loading}
        onPress={openMenu}
      />

      <Modal
        visible={state.modalVisible}
        transparent
        statusBarTranslucent
        animationType="none"
        presentationStyle="overFullScreen"
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={closeMenu}
      >
        <AnimatePresence>
          {state.menuVisible && state.rect && (
            <Menu rect={state.rect} items={items} onClose={closeMenu} />
          )}
        </AnimatePresence>
      </Modal>
    </>
  );
};

const Menu = ({
  rect,
  items,
  placement = 'bottom-end',
  onClose,
}: {
  rect: LayoutRectangle;
  items: ContextMenuItem[];
  placement?: Placement;
  onClose: () => void;
}) => {
  const { x, y, strategy, refs } = useFloating({
    middleware: [offset(10), flip(), shift()],
    placement,
    sameScrollView: false,
  });

  useScreenOrientation({ onBeforeChange: onClose });

  const animationProps: ViewProps =
    Platform.OS === 'web'
      ? {}
      : {
          animation: 'quick',
          opacity: 1,
          enterStyle: { opacity: 0 },
          exitStyle: { opacity: 0 },
        };

  return (
    <View
      {...animationProps}
      style={StyleSheet.absoluteFillObject}
      onPress={onClose}
    >
      <Blur style={StyleSheet.absoluteFillObject} />

      <Trigger {...rect} disabled ref={refs.setReference} collapsable={false} />

      <Card
        animation="quick"
        ref={refs.setFloating}
        y={0}
        enterStyle={{ opacity: 0, y: 10 }}
        exitStyle={{ opacity: 0, y: 10 }}
        position={strategy as 'absolute'}
        top={y - 5}
        left={x - 5}
        paddingVertical="$2"
        collapsable={false}
      >
        {items.map((item, index) => (
          <ListItem
            key={index}
            {...item}
            minWidth={200}
            onPress={() => {
              onClose();
              item.onPress();
              void impactAsync(ImpactFeedbackStyle.Light);
            }}
          />
        ))}
      </Card>
    </View>
  );
};

const Trigger = forwardRef(
  (
    {
      loading,
      disabled,
      onPress,
      ...viewProps
    }: ViewProps & { loading?: boolean },
    ref: Ref<TamaguiElement>,
  ) => {
    return (
      <View
        {...viewProps}
        ref={ref}
        disabled={disabled}
        opacity={disabled ? 0.8 : 1}
        cursor={disabled ? 'auto' : 'pointer'}
        pressStyle={{ opacity: 0.8 }}
        onPress={onPress}
      >
        {loading ? (
          <Spinner />
        ) : (
          <Icon.Dynamic
            type="Ionicons"
            name="ellipsis-vertical-outline"
            color="$buttonTextColor1"
          />
        )}
      </View>
    );
  },
);
