import { View, ViewProps } from 'tamagui';
import { H3 } from '../text/heading';
import { RegularText } from '../text/text';
import { Icon, IconName } from '../icons';
import { FormView } from './form-view';
import { useI18n } from '@symbiot-core-apps/shared';

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
  const { t } = useI18n();

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
          {message?.trim() || t('shared.its_empty')}
        </RegularText>
      </View>

      {children}
    </FormView>
  );
};
