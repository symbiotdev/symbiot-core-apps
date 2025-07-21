import { ReactNode } from 'react';
import { Platform, StyleSheet } from 'react-native';
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller';
import { useHeaderHeight } from '@react-navigation/elements';
import { ScrollView, View, ViewProps } from 'tamagui';
import { LoadingView } from './loading-view';
import { useRendered } from '@symbiot-core-apps/shared';
import { Refresher } from '../loading/refresher';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const isWeb = Platform.OS === 'web';
export const defaultPagePadding = 20;

export type PageViewProps = ViewProps & {
  lazy?: boolean;
  delay?: number;
  scrollable?: boolean;
  refreshing?: boolean;
  withKeyboard?: boolean;
  withHeaderHeight?: boolean;
  LoadingElement?: ReactNode;
  onRefresh?: () => void;
};

export const PageView = ({
  lazy,
  delay,
  scrollable,
  refreshing,
  withKeyboard,
  withHeaderHeight,
  LoadingElement,
  onRefresh,
  ...viewProps
}: PageViewProps) => {
  const { rendered } = useRendered({ defaultTrue: lazy === false, delay });
  const headerHeight = useHeaderHeight();

  if (!rendered) {
    return LoadingElement || <LoadingView />;
  }

  if (scrollable && withKeyboard) {
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        contentContainerStyle={styles.FullScreen}
        showsHorizontalScrollIndicator={isWeb}
        showsVerticalScrollIndicator={isWeb}
        bottomOffset={30}
        refreshControl={
          refreshing !== undefined ? (
            <Refresher refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        <PageContent {...viewProps} withHeaderHeight={withHeaderHeight} />
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
        <PageContent {...viewProps} withHeaderHeight={withHeaderHeight} />
      </KeyboardAvoidingView>
    );
  }

  if (scrollable) {
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={isWeb}
        showsVerticalScrollIndicator={isWeb}
        contentContainerStyle={styles.FullScreen}
        refreshControl={
          refreshing !== undefined ? (
            <Refresher refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        <PageContent {...viewProps} withHeaderHeight={withHeaderHeight} />
      </ScrollView>
    );
  }

  return <PageContent {...viewProps} withHeaderHeight={withHeaderHeight} />;
};

const PageContent = ({
  withHeaderHeight,
  paddingTop = defaultPagePadding,
  paddingBottom = defaultPagePadding,
  paddingLeft = defaultPagePadding,
  paddingRight = defaultPagePadding,
  ...viewProps
}: ViewProps & {
  withHeaderHeight?: boolean;
}) => {
  const { top, bottom, left, right } = useSafeAreaInsets();

  return (
    <View
      flex={1}
      width="100%"
      maxWidth={1440}
      marginHorizontal="auto"
      paddingTop={(withHeaderHeight ? 0 : top) + Number(paddingTop)}
      paddingBottom={bottom + Number(paddingBottom)}
      paddingLeft={left + Number(paddingLeft)}
      paddingRight={right + Number(paddingRight)}
      {...viewProps}
    />
  );
};

const styles = StyleSheet.create({
  FullScreen: {
    flexGrow: 1,
  },
});
