import { View, ViewProps } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { Error } from '../text/custom';

export const ErrorView = (
  props: ViewProps & {
    message?: string;
  }
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
