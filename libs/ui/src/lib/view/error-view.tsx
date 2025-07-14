import { View, ViewProps } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { RegularText } from '../text/text';

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
      <RegularText textAlign="center" color="$error">
        {props.message || t('shared.error.general')}
      </RegularText>
    </View>
  );
};
