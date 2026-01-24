import { Alert, Platform } from 'react-native';
import { translate } from '../i18n/i18n-provider';

export const ConfirmAlert = (props: {
  title: string;
  message?: string;
  onAgree: () => void;
  onCancel?: () => void;
  cancelText?: string;
  confirmText?: string;
}) => {
  if (Platform.OS === 'web') {
    if (window.confirm(`${props.title}\n\n${props.message || ''}`.trim())) {
      props.onAgree();
    } else {
      props.onCancel?.();
    }
  } else {
    Alert.alert(props.title, props.message || '', [
      {
        text: props.cancelText || translate('shared.cancel'),
        style: 'cancel',
        isPreferred: true,
        onPress: props.onCancel,
      },
      {
        text: props.confirmText || translate('shared.continue'),
        onPress: props.onAgree,
      },
    ]);
  }
};
