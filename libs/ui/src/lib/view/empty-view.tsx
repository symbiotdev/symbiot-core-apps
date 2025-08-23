import { View, ViewProps } from 'tamagui';
import { H2 } from '../text/heading';
import { RegularText } from '../text/text';
import { IconName } from '../icons/config';
import { Icon } from '../icons';
import { useTranslation } from 'react-i18next';

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
    <View
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding={20}
      gap="$5"
      {...viewProps}
    >
      {!!iconName && (
        <Icon name={iconName} size={40} color="$placeholderColor" />
      )}

      {!!title && <H2 textAlign="center">{title}</H2>}

      <RegularText color="$placeholderColor" textAlign="center" maxWidth={500}>
        {message || t('shared.its_empty')}
      </RegularText>

      {children}
    </View>
  );
};
