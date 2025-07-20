import { LoadingView } from '@symbiot-core-apps/ui';
import { Redirect } from 'expo-router';
import { useMe } from '@symbiot-core-apps/store';

export default () => {
  const { me } = useMe();

  if (!me) {
    return <LoadingView />;
  }

  return <Redirect href="/home" />;
};
