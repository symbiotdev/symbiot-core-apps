import { View, ViewProps } from 'tamagui';
import { Error } from '../text/custom';
import { useT } from '@symbiot-core-apps/i18n';

export const ErrorView = (
  props: ViewProps & {
    message?: string;
  },
) => {
  const { t } = useT();

  return (
    <View
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding={20}
      {...props}
    >
      <Error textAlign="center">
        {props.message || t('error.general')}
      </Error>
    </View>
  );
};
