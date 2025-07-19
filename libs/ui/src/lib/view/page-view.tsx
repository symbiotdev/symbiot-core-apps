import { PropsWithChildren, ReactNode } from 'react';
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

export const PageView = ({
  children,
  lazy,
  delay,
  scrollable,
  refreshing,
  withKeyboard,
  withHeaderHeight,
  viewProps,
  LoadingElement,
  onRefresh,
}: PropsWithChildren<
  ViewProps & {
    lazy?: boolean;
    delay?: number;
    scrollable?: boolean;
    refreshing?: boolean;
    withKeyboard?: boolean;
    withHeaderHeight?: boolean;
    viewProps?: Omit<ViewProps, 'children'>;
    LoadingElement?: ReactNode;
    onRefresh?: () => void;
  }
>) => {
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
        <PageContent {...viewProps} children={children} />
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
        <PageContent {...viewProps} children={children} />
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
        <PageContent {...viewProps} children={children} />
      </ScrollView>
    );
  }

  return <PageContent {...viewProps} children={children} />;
};

const PageContent = (props: ViewProps) => {
  const { top, bottom, left, right } = useSafeAreaInsets();

  return (
    <View
      flex={1}
      width="100%"
      maxWidth={1440}
      marginHorizontal="auto"
      paddingTop={top + 10}
      paddingBottom={bottom + 10}
      paddingLeft={left + 10}
      paddingRight={right + 10}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  FullScreen: {
    flexGrow: 1,
  },
});
