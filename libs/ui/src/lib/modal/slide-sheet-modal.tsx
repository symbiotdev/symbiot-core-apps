import { Modal } from 'react-native';
import { PropsWithChildren, ReactElement } from 'react';
import { View, ViewProps } from 'tamagui';
import { headerHeight, ModalHeader } from '../navigation/header';
import { PageView } from '../view/page-view';
import { isTablet } from '@symbiot-core-apps/shared';
import { PortalProvider } from '@tamagui/portal';

export const SlideSheetModal = ({
  children,
  visible,
  scrollable,
  headerLeft,
  headerTitle,
  headerRight,
  withKeyboard = true,
  onClose,
  ...viewProps
}: PropsWithChildren<
  ViewProps & {
    visible: boolean;
    scrollable?: boolean;
    withKeyboard?: boolean;
    headerLeft?: () => ReactElement;
    headerTitle?: string | (() => ReactElement);
    headerRight?: () => ReactElement;
    onClose: () => void;
  }
>) => (
  <Modal
    visible={visible}
    animationType="slide"
    presentationStyle={isTablet ? 'fullScreen' : 'pageSheet'}
    supportedOrientations={['portrait', 'landscape']}
    onRequestClose={onClose}
  >
    <PortalProvider shouldAddRootHost>
      <View flex={1} backgroundColor="$background">
        <ModalHeader
          headerLeft={headerLeft}
          headerTitle={headerTitle}
          headerRight={headerRight}
          onClose={onClose}
        />

        <PageView
          ignoreTopSafeArea
          withKeyboard={withKeyboard}
          withHeaderHeight={isTablet}
          scrollable={scrollable}
          paddingTop={isTablet ? undefined : headerHeight}
          {...viewProps}
        >
          {children}
        </PageView>
      </View>
    </PortalProvider>
  </Modal>
);
