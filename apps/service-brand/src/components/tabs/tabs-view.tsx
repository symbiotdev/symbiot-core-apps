import { PageView, PageViewProps } from '@symbiot-core-apps/ui';

export const TabsViewBottomOffset = 100;

export const TabsView = (props: PageViewProps) => (
  <PageView
    {...props}
    withHeaderHeight={props.withHeaderHeight}
    paddingBottom={TabsViewBottomOffset}
  />
);
