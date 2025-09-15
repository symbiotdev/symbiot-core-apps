import { View, ViewProps } from 'tamagui';
import { H3 } from '../text/heading';
import { RegularText } from '../text/text';
import { IconName } from '../icons/config';
import { Icon } from '../icons';
import { useTranslation } from 'react-i18next';
import { FormView } from './form-view';

export const EmptyView = ({
  iconName,
  title,
  message,
  children,
  ...viewProps
}: ViewProps & {
  iconName?: IconName;
  title?: string;
  message?: string;
}) => {
  const { t } = useTranslation();

  return (
    <FormView
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding={20}
      gap="$5"
      {...viewProps}
    >
      {!!iconName && <Icon name={iconName} size={60} />}

      <View gap="$2">
        {!!title && <H3 textAlign="center">{title}</H3>}

        <RegularText textAlign="center" maxWidth={500}>
          {message || t('shared.its_empty')}
        </RegularText>
      </View>

      {children}
    </FormView>
  );
};
