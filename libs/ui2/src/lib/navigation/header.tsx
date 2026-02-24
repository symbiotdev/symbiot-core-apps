import { View } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { PAGE_STYLE } from '../page/utils/style-rules';
import { HEADER_BACK_BUTTON_ICON } from './consts/dimensions';
import { HeaderSideElement } from './components/header-side-element';
import { HeaderButton } from './components/header-button';
import { GlassView } from '../glass/glass-view';
import { HeaderTitle } from './components/header-title';

export const Header = ({
  back,
  navigation,
  top,
  left,
  right,
  height,
  options,
}: NativeStackHeaderProps & {
  top: number;
  left: number;
  right: number;
  height: number;
}) => {
  const withContent = Boolean(
    back ||
    options.headerLeft ||
    options.headerRight ||
    typeof options.headerTitle === 'string' ||
    typeof options.headerTitle === 'function',
  );

  return (
    withContent && (
      <View
        style={{
          height,
          position: 'relative',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 5,
          zIndex: 2,
          paddingTop: top,
          paddingLeft: left + PAGE_STYLE.paddingHorizontal,
          paddingRight: right + PAGE_STYLE.paddingHorizontal,
        }}
      >
        <HeaderSideElement
          alignItems="flex-start"
          children={
            typeof options.headerLeft === 'function'
              ? options.headerLeft({})
              : !!back && (
                  <HeaderButton
                    iconName={HEADER_BACK_BUTTON_ICON}
                    onPress={navigation.goBack}
                  />
                )
          }
        />

        {!!options.headerTitle && (
          <GlassView
            interactive={typeof options.headerTitle === 'function'}
            style={{
              zIndex: 1,
              borderRadius: 20,
              minHeight: 40,
              flexShrink: 1,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {typeof options.headerTitle === 'string' && (
              <HeaderTitle title={options.headerTitle} />
            )}

            {typeof options.headerTitle === 'function' &&
              options.headerTitle({ children: '' })}
          </GlassView>
        )}

        <HeaderSideElement
          alignItems="flex-end"
          children={options.headerRight?.({})}
        />
      </View>
    )
  );
};
