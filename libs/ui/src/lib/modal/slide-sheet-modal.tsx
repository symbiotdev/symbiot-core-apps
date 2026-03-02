import { DimensionValue, Modal, ModalProps, StyleSheet } from 'react-native';
import { BaseSyntheticEvent, PropsWithChildren, ReactElement } from 'react';
import { ScrollView, View, ViewProps } from 'tamagui';
import { isIos, isTablet, isWeb, useInsets } from '@symbiot-core-apps/shared';
import { PortalProvider } from '@tamagui/portal';
import { ContainerView, ContainerViewProps } from '../view/container-view';
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller';
import {
  HEADER_HEIGHT,
  ModalHeader,
  PAGE_STYLE,
  Refresher,
  useHeaderHeight,
} from '@symbiot-core-apps/ui2';

export const SlideSheetModal = ({
  children,
  visible,
  scrollable,
  headerLeft,
  headerTitle,
  headerRight,
  ignoreBottomSafeArea,
  transparentHeader,
  supportedOrientations = ['portrait', 'landscape'],
  withKeyboard = true,
  onClose,
  paddingTop = isTablet ? undefined : HEADER_HEIGHT,
  ...viewProps
}: PropsWithChildren<
  ViewProps & {
    paddingTop?: DimensionValue;
    visible: boolean;
    scrollable?: boolean;
    withKeyboard?: boolean;
    transparentHeader?: boolean;
    ignoreBottomSafeArea?: boolean;
    supportedOrientations?: ModalProps['supportedOrientations'];
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
    supportedOrientations={supportedOrientations}
    onRequestClose={onClose}
  >
    <PortalProvider shouldAddRootHost>
      <View flex={1} backgroundColor="$background" position="relative">
        <ModalHeader
          headerLeft={headerLeft}
          headerTitle={headerTitle}
          headerRight={headerRight}
          onClose={onClose}
        />

        <PageView
          ignoreTopSafeArea={isIos}
          ignoreBottomSafeArea={ignoreBottomSafeArea}
          withKeyboard={withKeyboard}
          withHeaderHeight={isTablet}
          scrollable={scrollable}
          paddingTop={paddingTop}
          {...viewProps}
        >
          {children}
        </PageView>
      </View>
    </PortalProvider>
  </Modal>
);

const PageView = ({
  scrollable,
  scrollEnabled = true,
  refreshing,
  withKeyboard,
  withHeaderHeight,
  onRefresh,
  ...viewProps
}: ContainerViewProps & {
  scrollable?: boolean;
  refreshing?: boolean;
  withKeyboard?: boolean;
  scrollEnabled?: boolean;
  withHeaderHeight?: boolean;
  ignoreTopSafeArea?: boolean;
  ignoreBottomSafeArea?: boolean;
  onRefresh?: () => void;
}) => {
  const headerHeight = useHeaderHeight();

  if (scrollable && withKeyboard) {
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        scrollEnabled={scrollEnabled}
        contentContainerStyle={styles.FullScreen}
        showsHorizontalScrollIndicator={isWeb}
        showsVerticalScrollIndicator={isWeb}
        bottomOffset={30}
        refreshControl={
          refreshing !== undefined && !isWeb ? (
            <Refresher refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        <PageContent withHeaderHeight={withHeaderHeight} {...viewProps} />
      </KeyboardAwareScrollView>
    );
  }

  if (withKeyboard) {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.FullScreen}
        keyboardVerticalOffset={withHeaderHeight ? headerHeight : undefined}
      >
        <PageContent withHeaderHeight={withHeaderHeight} {...viewProps} />
      </KeyboardAvoidingView>
    );
  }

  if (scrollable) {
    return (
      <ScrollView
        scrollEnabled={scrollEnabled}
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={isWeb}
        showsVerticalScrollIndicator={isWeb}
        contentContainerStyle={styles.FullScreen}
        refreshControl={
          refreshing !== undefined && !isWeb ? (
            <Refresher refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        <PageContent withHeaderHeight={withHeaderHeight} {...viewProps} />
      </ScrollView>
    );
  }

  return <PageContent withHeaderHeight={withHeaderHeight} {...viewProps} />;
};

const PageContent = ({
  withHeaderHeight = false,
  ignoreTopSafeArea = false,
  ignoreBottomSafeArea = false,
  paddingTop = PAGE_STYLE.paddingVertical,
  paddingBottom = PAGE_STYLE.paddingVertical,
  paddingLeft = PAGE_STYLE.paddingHorizontal,
  paddingRight = PAGE_STYLE.paddingHorizontal,
  ...viewProps
}: ContainerViewProps & {
  withHeaderHeight?: boolean;
  ignoreTopSafeArea?: boolean;
  ignoreBottomSafeArea?: boolean;
}) => {
  const headerHeight = useHeaderHeight();
  const { top, bottom, left, right } = useInsets();

  return (
    <ContainerView
      flex={1}
      {...viewProps}
      paddingTop={
        (withHeaderHeight ? headerHeight : !ignoreTopSafeArea ? top : 0) +
        Number(paddingTop)
      }
      paddingBottom={
        (!ignoreBottomSafeArea ? bottom : 0) + Number(paddingBottom)
      }
      paddingLeft={left + Number(paddingLeft)}
      paddingRight={right + Number(paddingRight)}
    />
  );
};

const styles = StyleSheet.create({
  FullScreen: {
    flexGrow: 1,
  },
});
