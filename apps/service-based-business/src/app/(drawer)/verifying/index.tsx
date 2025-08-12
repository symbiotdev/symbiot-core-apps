import { EventArg, NavigationAction } from '@react-navigation/native';
import { LoadingView } from '@symbiot-core-apps/ui';
import { useNavigation } from 'expo-router';
import { useCallback, useEffect } from 'react';

export default () => {
  const navigation = useNavigation();
  const onLeave = useCallback(
    (e: EventArg<'beforeRemove', true, { action: NavigationAction }>) =>
      e.preventDefault(),
    [],
  );

  useEffect(() => {
    navigation.addListener('beforeRemove', onLeave);

    return () => {
      navigation.removeListener('beforeRemove', onLeave);
    };
  }, [onLeave, navigation]);

  return <LoadingView />;
};
