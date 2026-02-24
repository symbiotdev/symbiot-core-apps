import { Text, ViewProps } from 'react-native';
import { useI18n } from '@symbiot-core-apps/shared';
import { memo } from 'react';
import { Compactor } from '../layout/compactor';

export const FalseView = memo(
  ({
    message,
    style,
    ...viewProps
  }: ViewProps & {
    message?: string;
  }) => {
    const { t } = useI18n();

    return (
      <Compactor
        {...viewProps}
        style={[
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          },
          style,
        ]}
      >
        {/*fixme - colorize*/}
        <Text style={{ color: 'red' }}>
          {message || t('shared.error.general')}
        </Text>
      </Compactor>
    );
  },
);
