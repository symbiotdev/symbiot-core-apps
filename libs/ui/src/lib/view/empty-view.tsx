import { View, ViewProps } from 'tamagui';
import { H2 } from '../text/heading';
import { RegularText } from '../text/text';
import { useT } from '@symbiot-core-apps/i18n';
import { IconName } from '../icons/config';
import { Icon } from '../icons';

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
  const { t } = useT();

  return (
    <View
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding={20}
      {...viewProps}
    >
      {!!iconName && (
        <Icon name={iconName} size={40} color="$placeholderColor" />
      )}

      {!!title && (
        <H2 textAlign="center" marginTop={iconName ? 10 : undefined}>
          {title}
        </H2>
      )}

      <RegularText
        color="$placeholderColor"
        textAlign="center"
        maxWidth={500}
        marginTop={iconName || title ? 10 : undefined}
      >
        {message || t('its_empty')}
      </RegularText>

      {children}
    </View>
  );
};
