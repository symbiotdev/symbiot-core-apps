import { alert, dismissAllAlerts } from 'burnt';
import { Keyboard, Platform } from 'react-native';
import i18n from 'i18next';

export const ShowNativeSuccessAlert = (options: {
  title: unknown;
  subtitle?: unknown;
  duration?: number;
}) => {
  if (typeof options !== 'object' || (!options?.title && !options?.subtitle)) {
    return;
  }

  alert({
    title: String(options.title),
    message: options.subtitle ? String(options.subtitle) : undefined,
    preset: 'done',
    shouldDismissByTap: true,
    duration: options.duration || 2,
  });
};

export const ShowNativeFailedAlert = (options: {
  text: string;
  duration?: number;
}) => {
  if (typeof options !== 'object') {
    return;
  }

  alert({
    title: Platform.OS !== 'ios' ? options.text : '',
    message: Platform.OS === 'ios' ? options.text : '',
    preset: 'error',
    shouldDismissByTap: true,
    duration: options.duration || 2,
  });
};

export const ShowNativeLoadingAlert = (options?: { title: unknown }) => {
  Keyboard.dismiss();

  alert({
    title:
      typeof options === 'object' && options.title
        ? String(options.title)
        : i18n.t('loading'),
    duration: 60,
    preset: 'spinner',
    shouldDismissByTap: false,
  });
};

export const HideNativeAlerts = (delay = 0) => {
  setTimeout(() => dismissAllAlerts(), delay);
};
