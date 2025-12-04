import { InitView } from '@symbiot-core-apps/ui';
import { useBrandMembershipProfileByIdReq } from '@symbiot-core-apps/api';
import { useLocalSearchParams } from 'expo-router';
import { RemoveBrandMembership } from '@symbiot-core-apps/brand-membership';

export default () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const {
    data: membership,
    isPending,
    error,
  } = useBrandMembershipProfileByIdReq(id, false);

  if (!membership || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return (
    <RemoveBrandMembership type={membership.type} membership={membership} />
  );
};
