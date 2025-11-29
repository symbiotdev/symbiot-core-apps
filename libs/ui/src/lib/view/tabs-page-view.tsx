import {
  defaultPageHorizontalPadding,
  PageView,
  PageViewProps,
} from './page-view';
import { tabBarHeight } from '../navigation/tabs';

export const TabsPageView = (props: PageViewProps) => {
  return (
    <PageView
      paddingBottom={tabBarHeight + defaultPageHorizontalPadding}
      {...props}
    ></PageView>
  );
};
