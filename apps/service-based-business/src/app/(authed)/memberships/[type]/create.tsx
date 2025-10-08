import { CreateBrandMembership } from '@symbiot-core-apps/brand-membership';
import { useLocalSearchParams } from 'expo-router';
import { BrandMembershipType } from '@symbiot-core-apps/api';

export default () => {
  const { type } = useLocalSearchParams<{ type: BrandMembershipType }>();

  return <CreateBrandMembership type={type} />;
};
