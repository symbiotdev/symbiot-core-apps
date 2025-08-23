import { Redirect } from 'expo-router';
import { useCurrentBrandState } from '@symbiot-core-apps/state';

export default () => {
  const { brand: currentBrand } = useCurrentBrandState();

  return <Redirect href={currentBrand ? '/home' : '/brand'} />;
}
