import { memo } from 'react';
import { useI18n } from '@symbiot-core-apps/shared';
import { Text, View, ViewProps } from 'react-native';
import { Icon, IconName } from '../icon/icon';
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
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            padding: 10,
          },
          style,
        ]}
      >
        {!!iconName && <Icon name={iconName} size={60} />}

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

          {!!message && (
            <Text style={{ color, textAlign: 'center' }}>
              {message?.trim() || t('shared.its_empty')}
            </Text>
          )}
        </View>

        {children}
      </Compactor>
    );
  },
);
