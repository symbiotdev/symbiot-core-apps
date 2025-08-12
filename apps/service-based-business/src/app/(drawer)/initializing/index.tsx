import { EventArg, NavigationAction } from '@react-navigation/native';
import { LoadingView } from '@symbiot-core-apps/ui';
import { useNavigation } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { useInitializing } from '../../../hooks/use-initializing';

export default () => {
  const navigation = useNavigation();
  const initializing = useInitializing();
  const onLeave = useCallback(
    (e: EventArg<'beforeRemove', true, { action: NavigationAction }>) =>
      !initializing && e.preventDefault(),
    [initializing],
  );

  useEffect(() => {
    navigation.addListener('beforeRemove', onLeave);

    return () => {
      navigation.removeListener('beforeRemove', onLeave);
    };
  }, [onLeave, navigation]);

  return <LoadingView />;
};
