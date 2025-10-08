import { InitView } from '@symbiot-core-apps/ui';
import {
  BrandMembershipType,
  useBrandMembershipProfileByIdQuery,
} from '@symbiot-core-apps/api';
import { useLocalSearchParams } from 'expo-router';
import { RemoveBrandMembership } from '@symbiot-core-apps/brand-membership';

export default () => {
  const { id, type } = useLocalSearchParams<{
    id: string;
    type: BrandMembershipType;
  }>();
  const {
    data: membership,
    isPending,
    error,
  } = useBrandMembershipProfileByIdQuery(id, false);

  if (!membership || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return <RemoveBrandMembership type={type} membership={membership} />;
};
