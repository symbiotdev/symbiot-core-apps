import { Container, ContainerProps } from '../../layout/container';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PAGE_STYLE } from '../utils/style-rules';

export type PageContentProps = ContainerProps & {
  ignoreHeaderHeight?: boolean;
  ignoreTopSafeArea?: boolean;
  ignoreBottomSafeArea?: boolean;
};

export const PageContent = ({
  ignoreHeaderHeight,
  ignoreTopSafeArea,
  ignoreBottomSafeArea,
  style,
  ...containerProps
}: PageContentProps) => {
  const { top, bottom, left, right } = useSafeAreaInsets();
  // fixme - replace with real height
  const headerHeight = top + 60;

  const paddings = {
    paddingTop:
      (!ignoreHeaderHeight ? headerHeight : !ignoreTopSafeArea ? top : 0) +
      PAGE_STYLE.paddingVertical,
    paddingBottom:
      (!ignoreBottomSafeArea ? bottom : 0) + PAGE_STYLE.paddingVertical,
    paddingLeft: left + PAGE_STYLE.paddingHorizontal,
    paddingRight: right + PAGE_STYLE.paddingHorizontal,
  };

  return (
    <Container {...containerProps} style={[{ flex: 1, ...paddings }, style]} />
  );
};
