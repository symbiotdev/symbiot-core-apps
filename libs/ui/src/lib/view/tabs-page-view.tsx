import { Platform } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { defaultPagePadding, PageView, PageViewProps } from './page-view';

export const TabsPageView = (props: PageViewProps) => {
  const bottomTabBarHeight = useBottomTabBarHeight();

  if (Platform.OS === 'android') {
    return <PageView {...props} />;
  }

  return (
    <PageView paddingBottom={bottomTabBarHeight + defaultPagePadding} {...props}></PageView>
  );
};
