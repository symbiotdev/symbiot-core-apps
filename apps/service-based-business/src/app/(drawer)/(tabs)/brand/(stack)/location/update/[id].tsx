import { BrandLocationForm } from '@symbiot-core-apps/brand-location';
import { useLocalSearchParams } from 'expo-router';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <BrandLocationForm id={id} />;
};
