import { useBrandMembershipProfileByIdReq } from '@symbiot-core-apps/api';
import { useLocalSearchParams } from 'expo-router';
import { RemoveBrandMembership } from '@symbiot-core-apps/brand-membership';
import { FallbackView } from '@symbiot-core-apps/ui2';

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
    return <FallbackView loading={isPending} error={error} />;
  }

  return (
    <RemoveBrandMembership type={membership.type} membership={membership} />
  );
};
