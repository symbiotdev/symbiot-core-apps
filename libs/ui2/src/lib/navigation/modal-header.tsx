import { BaseSyntheticEvent, memo, ReactElement } from 'react';
import { isIos, useInsets } from '@symbiot-core-apps/shared';
import { View } from 'react-native';
import { HEADER_HEIGHT } from './consts/dimensions';
import { PAGE_STYLE } from '../page/utils/style-rules';
import { HeaderSideElement } from './components/header-side-element';
import { GlassView } from '../glass/glass-view';
import { HeaderTitle } from './components/header-title';
import { HeaderButton } from './components/header-button';

export const ModalHeader = memo(
  ({
    headerLeft,
    headerRight,
    headerTitle,
    onClose,
  }: {
    headerLeft?: () => ReactElement;
    headerTitle?: string | (() => ReactElement);
    headerRight?: () => ReactElement;
    onClose?: (e: BaseSyntheticEvent) => void;
  }) => {
    const { top, left, right } = useInsets();

    const _top = isIos ? 5 : top;

    return (
      <View
        style={{
          position: 'absolute',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 5,
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          height: _top + HEADER_HEIGHT,
          paddingTop: _top,
          paddingLeft: left + PAGE_STYLE.paddingHorizontal,
          paddingRight: right + PAGE_STYLE.paddingHorizontal,
        }}
      >
        <HeaderSideElement alignItems="flex-start" children={headerLeft?.()} />

        {!!headerTitle && (
          <GlassView
            interactive={typeof headerTitle === 'function'}
            style={{
              zIndex: 1,
              borderRadius: 20,
              paddingVertical: 5,
              paddingHorizontal: 10,
              minHeight: 40,
              flexShrink: 1,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {typeof headerTitle === 'string' && (
              <HeaderTitle title={headerTitle} />
            )}

            {typeof headerTitle === 'function' && headerTitle()}
          </GlassView>
        )}

        <HeaderSideElement
          alignItems="flex-end"
          children={
            typeof headerRight === 'function' ? (
              headerRight()
            ) : (
              <HeaderButton iconName="Close" onPress={onClose} />
            )
          }
        />
      </View>
    );
  },
);
