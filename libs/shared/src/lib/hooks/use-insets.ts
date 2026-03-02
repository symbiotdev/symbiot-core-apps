import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isAndroid } from '../utils/device';

export const useInsets = ({
  ignoreAndroidIssue,
}: { ignoreAndroidIssue?: boolean } = {}) => {
  const insets = useSafeAreaInsets();

  return {
    ...insets,
    ...(isAndroid && {
      bottom: insets.bottom + (ignoreAndroidIssue ? 0 : 30),
    }),
  };
};
