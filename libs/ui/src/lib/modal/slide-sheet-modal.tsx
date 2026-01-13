import { DimensionValue, Modal } from 'react-native';
import { BaseSyntheticEvent, PropsWithChildren, ReactElement } from 'react';
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
  ignoreBottomSafeArea,
  transparentHeader,
  withKeyboard = true,
  onClose,
  paddingTop,
  ...viewProps
}: PropsWithChildren<
  ViewProps & {
    paddingTop?: DimensionValue;
    visible: boolean;
    scrollable?: boolean;
    withKeyboard?: boolean;
    transparentHeader?: boolean;
    ignoreBottomSafeArea?: boolean;
    headerLeft?: () => ReactElement;
    headerTitle?: string | (() => ReactElement);
    headerRight?: () => ReactElement;
    onClose: (e: BaseSyntheticEvent) => void;
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
      <View flex={1} backgroundColor="$background" position="relative">
        <ModalHeader
          transparent={transparentHeader}
          headerLeft={headerLeft}
          headerTitle={headerTitle}
          headerRight={headerRight}
          onClose={onClose}
        />

        <PageView
          ignoreTopSafeArea
          ignoreBottomSafeArea={ignoreBottomSafeArea}
          withKeyboard={withKeyboard}
          withHeaderHeight={isTablet}
          scrollable={scrollable}
          paddingTop={paddingTop || (isTablet ? undefined : headerHeight)}
          {...viewProps}
        >
          {children}
        </PageView>
      </View>
    </PortalProvider>
  </Modal>
);
