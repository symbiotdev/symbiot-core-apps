import { View, ViewProps } from 'tamagui';
import { H2 } from '../text/heading';
import { RegularText } from '../text/text';
import { useT } from '@symbiot-core-apps/i18n';
import { IconName } from '../icons/config';
import { Icon } from '../icons';

export const EmptyView = (
  props: ViewProps & {
    iconName?: IconName;
    title?: string;
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
      {!!props.iconName && (
        <Icon name={props.iconName} size={40} color="$placeholderColor" />
      )}

      {!!props.title && (
        <H2 textAlign="center" marginTop={props.iconName ? 10 : undefined}>
          {props.title}
        </H2>
      )}

      <RegularText
        color="$placeholderColor"
        textAlign="center"
        maxWidth={500}
        marginTop={props.iconName || props.title ? 10 : undefined}
      >
        {props.message || t('its_empty')}
      </RegularText>

      {props.children}
    </View>
  );
};
