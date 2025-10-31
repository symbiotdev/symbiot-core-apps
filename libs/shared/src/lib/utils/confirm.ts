import { Alert, Platform } from 'react-native';
import i18n from 'i18next';

export const ConfirmAlert = (props: {
  title: string;
  message?: string;
  callback: () => void;
  cancelText?: string;
  confirmText?: string;
}) => {
  if (Platform.OS === 'web') {
    if (window.confirm(`${props.title}\n\n${props.message || ''}`.trim())) {
      props.callback();
    }
  }

  Alert.alert(props.title, props.message || '', [
    {
      text: props.cancelText || i18n.t('shared.cancel'),
      style: 'cancel',
      isPreferred: true,
    },
    {
      text: props.confirmText || i18n.t('shared.continue'),
      onPress: props.callback,
    },
  ]);
};
