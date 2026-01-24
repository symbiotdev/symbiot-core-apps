import { View, ViewProps } from 'tamagui';
import { Error } from '../text/custom';
import { useI18n } from '@symbiot-core-apps/shared';

export const ErrorView = (
  props: ViewProps & {
    message?: string;
  },
) => {
  const { t } = useI18n();

  return (
    <View
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding={20}
      {...props}
    >
      <Error textAlign="center">
        {props.message || t('shared.error.general')}
      </Error>
    </View>
  );
};
