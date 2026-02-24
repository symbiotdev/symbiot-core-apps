import { memo } from 'react';
import { useI18n } from '@symbiot-core-apps/shared';
import { Text, View, ViewProps } from 'react-native';
import { DEFAULT_ICON_SIZE, Icon, IconName } from '../icon/icon';
import { Compactor } from '../layout/compactor';
import { useAppScheme } from '@symbiot-core-apps/state';

export const EmptyView = memo(
  ({
    title,
    message,
    iconName,
    children,
    style,
    ...viewProps
  }: ViewProps & {
    title?: string;
    message?: string;
    iconName?: IconName;
  }) => {
    const { t } = useI18n();
    const { scheme } = useAppScheme();
    // fixme - colorize
    const color = scheme === 'dark' ? '#FFFFFF' : '#000000';

    return (
      <Compactor
        {...viewProps}
        style={[
          {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: 20,
          },
          style,
        ]}
      >
        {!!iconName && (
          <Icon color={color} name={iconName} size={DEFAULT_ICON_SIZE * 1.5} />
        )}

        <View style={{ gap: 5 }}>
          {!!title && (
            <Text
              style={{
                color,
                textAlign: 'center',
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {title?.trim()}
            </Text>
          )}

          <Text style={{ color: '#999999', textAlign: 'center' }}>
            {message?.trim() || t('shared.its_empty')}
          </Text>
        </View>

        {children}
      </Compactor>
    );
  },
);
