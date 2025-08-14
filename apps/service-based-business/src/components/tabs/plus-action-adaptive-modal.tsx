import { AdaptivePopover, HapticTabBarButton } from '@symbiot-core-apps/ui';
import React from 'react';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

export const PlusActionAdaptiveModal = (props: BottomTabBarButtonProps) => {
  return (
    <AdaptivePopover
      triggerType="child"
      trigger={<HapticTabBarButton style={props.style} children={props.children} />}
    ></AdaptivePopover>
  );
};
