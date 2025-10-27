import { useLocalSearchParams } from 'expo-router';
import { useBrandClientMembershipByIdReq } from '@symbiot-core-apps/api';
import { InitView } from '@symbiot-core-apps/ui';
import { RemoveBrandClientMembership } from '@symbiot-core-apps/brand-client';

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
    return <InitView loading={isPending} error={error} />;
  }

  return <RemoveBrandClientMembership clientId={id} membership={membership} />;
};
