import { Modal } from 'react-native';
import { headerHeight, ModalHeader, PageView } from '@symbiot-core-apps/ui';
import { PropsWithChildren, ReactElement } from 'react';
import { useTheme } from 'tamagui';

export const SlideSheetModal = ({
  children,
  visible,
  scrollable,
  headerLeft,
  headerTitle,
  headerRight,
  onClose,
}: PropsWithChildren<{
  visible: boolean;
  scrollable?: boolean;
  headerLeft?: () => ReactElement;
  headerTitle?: string | (() => ReactElement);
  headerRight?: () => ReactElement;
  onClose: () => void;
}>) => {
  const theme = useTheme();

  return (
    <Modal
      backdropColor={theme.background1?.val}
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      supportedOrientations={['portrait', 'landscape']}
      onRequestClose={onClose}
    >
      <ModalHeader
        headerLeft={headerLeft}
        headerTitle={headerTitle}
        headerRight={headerRight}
        onClose={onClose}
      />

      <PageView
        ignoreTopSafeArea
        scrollable={scrollable}
        paddingTop={headerHeight}
      >
        {children}
      </PageView>
    </Modal>
  );
};
