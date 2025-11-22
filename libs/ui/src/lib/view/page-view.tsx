import { Platform, StyleSheet } from 'react-native';
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller';
import { ScrollView } from 'tamagui';
import { useKeyboard } from '@symbiot-core-apps/shared';
import { Refresher } from '../loading/refresher';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScreenHeaderHeight } from '../navigation/header';
import { ContainerView, ContainerViewProps } from './container-view';

const isWeb = Platform.OS === 'web';
export const defaultPageHorizontalPadding = 14;
export const defaultPageVerticalPadding = 14;

export type PageViewProps = ContainerViewProps & {
  scrollable?: boolean;
  refreshing?: boolean;
  withKeyboard?: boolean;
  scrollEnabled?: boolean;
  withHeaderHeight?: boolean;
  ignoreTopSafeArea?: boolean;
  ignoreBottomSafeArea?: boolean;
  onRefresh?: () => void;
};

export const PageView = ({
  scrollable,
  scrollEnabled = true,
  refreshing,
  withKeyboard,
  withHeaderHeight,
  onRefresh,
  ...viewProps
}: PageViewProps) => {
  const headerHeight = useScreenHeaderHeight();

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
          refreshing !== undefined && Platform.OS !== 'web' ? (
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
          refreshing !== undefined && Platform.OS !== 'web' ? (
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
  paddingTop = defaultPageVerticalPadding,
  paddingBottom = defaultPageVerticalPadding,
  paddingLeft = defaultPageHorizontalPadding,
  paddingRight = defaultPageHorizontalPadding,
  ...viewProps
}: ContainerViewProps & {
  withHeaderHeight?: boolean;
  ignoreTopSafeArea?: boolean;
  ignoreBottomSafeArea?: boolean;
}) => {
  const headerHeight = useScreenHeaderHeight();
  const { currentHeight: keyboardHeight } = useKeyboard();
  const { top, bottom, left, right } = useSafeAreaInsets();

  return (
    <ContainerView
      flex={1}
      {...viewProps}
      paddingTop={
        (withHeaderHeight ? headerHeight : !ignoreTopSafeArea ? top : 0) +
        Number(paddingTop)
      }
      paddingBottom={
        (!ignoreBottomSafeArea && !keyboardHeight ? bottom : 0) +
        Number(paddingBottom)
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
