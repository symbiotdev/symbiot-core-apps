import { useLocalSearchParams } from 'expo-router';
import { useBrandClientMembershipByIdReq } from '@symbiot-core-apps/api';
import { RemoveBrandClientMembership } from '@symbiot-core-apps/brand-client';
import { FallbackView } from '@symbiot-core-apps/ui2';

export default () => {
  const { id, membershipId } = useLocalSearchParams<{
    id: string;
    membershipId: string;
  }>();
  const {
    data: membership,
    error,
    isPending,
  } = useBrandClientMembershipByIdReq(id, membershipId, false);

  if (!membership || error) {
    return <FallbackView loading={isPending} error={error} />;
  }

  return <RemoveBrandClientMembership clientId={id} membership={membership} />;
};
