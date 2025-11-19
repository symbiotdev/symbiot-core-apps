import { Sheet as SheetUI, View } from 'tamagui';
import {
  defaultPageHorizontalPadding,
  defaultPageVerticalPadding,
} from '@symbiot-core-apps/ui';
import React, { PropsWithChildren } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const Sheet = ({
  children,
  opened,
  onOpen,
  onClose,
}: PropsWithChildren<{
  opened: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}>) => {
  const { left, right, bottom } = useSafeAreaInsets();

  return (
    <SheetUI
      modal
      dismissOnSnapToBottom
      animation="quick"
      snapPointsMode="fit"
      open={opened}
      onOpenChange={(open: boolean) => (!open ? onClose?.() : onOpen?.())}
    >
      <SheetUI.Overlay
        backgroundColor="$background"
        animation="quick"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        opacity={0.8}
      />

      <SheetUI.Frame
        borderTopLeftRadius="$10"
        borderTopRightRadius="$10"
        backgroundColor="$background1"
        position="relative"
        paddingLeft={left}
        paddingRight={right}
      >
        <View
          width={50}
          height={4}
          borderRadius="$10"
          cursor="pointer"
          backgroundColor="$disabled"
          marginVertical={defaultPageVerticalPadding}
          marginHorizontal="auto"
        />

        <SheetUI.ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: '80%' }}
          contentContainerStyle={{
            gap: 10,
            paddingBottom: bottom + defaultPageHorizontalPadding,
            paddingHorizontal: defaultPageHorizontalPadding,
          }}
        >
          {children}
        </SheetUI.ScrollView>
      </SheetUI.Frame>
    </SheetUI>
  );
};
