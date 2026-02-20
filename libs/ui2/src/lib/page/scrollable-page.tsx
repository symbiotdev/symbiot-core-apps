import { isWeb } from '@symbiot-core-apps/shared';
import { ScrollView } from 'tamagui';
import { Refresher } from '../progress/refresher';
import { PageShadow } from './components/page-shadow';
import { PageContent, PageContentProps } from './components/page-content';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

// fixme - rename to ScrollPage
export const ScrollablePage = ({
  refreshable,
  refreshing,
  scrollEnabled,
  withKeyboard,
  onRefresh,
  ...pageContentProps
}: PageContentProps & {
  refreshable?: boolean;
  refreshing?: boolean;
  scrollEnabled?: boolean;
  withKeyboard?: boolean;
  onRefresh?: () => void;
}) => {
  const ScrollableComponent = withKeyboard
    ? KeyboardAwareScrollView
    : ScrollView;

  return (
    <>
      <ScrollableComponent
        scrollEnabled={scrollEnabled}
        keyboardDismissMode="none"
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={isWeb}
        showsVerticalScrollIndicator={isWeb}
        contentContainerStyle={{ flexGrow: 1 }}
        bottomOffset={30}
        refreshControl={
          // todo check
          Boolean(refreshable) && !isWeb ? (
            <Refresher refreshing={Boolean(refreshing)} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        <PageContent {...pageContentProps} />
      </ScrollableComponent>

      <PageShadow />
    </>
  );
};
