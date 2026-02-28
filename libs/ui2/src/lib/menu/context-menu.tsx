import { cloneElement, ReactElement, useRef } from 'react';
import { GestureResponderEvent, Pressable, Text, View } from 'react-native';
import { AdaptiveSheet, AdaptiveSheetRef } from '../sheet/adaptive-sheet';
import { Spinner } from '../progress/spinner';
import { Icon } from '../icon/icon';
import { useAppScheme } from '@symbiot-core-apps/state';

export type ContextMenuItem = {
  label: string;
  icon?: false | ReactElement<{ color?: string; size?: number }>;
  iconSize?: number;
  color?: string;
  onPress: (e: GestureResponderEvent) => void;
};

export const ContextMenu = ({
  items,
  disabled,
  loading,
}: {
  items: ContextMenuItem[];
  disabled?: boolean;
  loading?: boolean;
}) => {
  const { scheme } = useAppScheme();

  const sheetRef = useRef<AdaptiveSheetRef>(null);

  // fixme colorize
  const color = scheme === 'dark' ? '#FFFFFF' : '#000000';

  return (
    <AdaptiveSheet
      excludePaddings
      popoverPlacement="bottom-start"
      forceAdaptive="popover"
      ref={sheetRef}
      triggerDisabled={disabled}
      popoverOffset={5}
      trigger={
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
          }}
        >
          {loading ? <Spinner /> : <Icon name="MenuDotsCircle" />}
        </View>
      }
    >
      <View style={{ paddingVertical: 10 }}>
        {items.map((item, index) => (
          <Pressable
            key={index}
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              paddingHorizontal: 20,
              paddingVertical: 10,
              gap: 10,
            }}
            onPress={(e) => {
              sheetRef.current?.hide();
              item.onPress(e);
            }}
          >
            {!!item.icon &&
              cloneElement(item.icon, {
                color: item.color || color,
                size: item.iconSize,
              })}

            <Text style={{ color: item.color || color }} numberOfLines={1}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </AdaptiveSheet>
  );
};
