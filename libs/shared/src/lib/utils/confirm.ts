import { Alert, Platform } from 'react-native';
import i18n from 'i18next';

export const ConfirmAlert = (props: {
  title: string;
  message?: string;
  callback: () => void;
}) => {
  if (Platform.OS === 'web') {
    if (window.confirm(`${props.title}\n\n${props.message || ''}`.trim())) {
      props.callback();
    }
  }

  Alert.alert(props.title, '', [
    {
      text: i18n.t('cancel'),
      style: 'cancel',
      isPreferred: true,
    },
    {
      text: i18n.t('continue'),
      onPress: props.callback,
    },
  ]);
};
