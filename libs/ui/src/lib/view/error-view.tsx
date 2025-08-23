import { View, ViewProps } from 'tamagui';
import { Error } from '../text/custom';
import { useTranslation } from 'react-i18next';

export const ErrorView = (
  props: ViewProps & {
    message?: string;
  },
) => {
  const { t } = useTranslation();

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
