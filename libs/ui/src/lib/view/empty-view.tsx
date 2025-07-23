import { View, ViewProps } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { H2 } from '../text/heading';
import { RegularText } from '../text/text';

export const EmptyView = (
  props: ViewProps & {
    emoji?: string;
    title?: string;
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
      {!!props.emoji && (
        <RegularText textAlign="center" fontSize={40}>
          {props.emoji}
        </RegularText>
      )}

      {!!props.title && (
        <H2 textAlign="center" marginVertical={10}>
          {props.title}
        </H2>
      )}

      <RegularText color="$disabled" textAlign="center" maxWidth={500}>
        {props.message || t('shared.its_empty')}
      </RegularText>

      {props.children}
    </View>
  );
};
