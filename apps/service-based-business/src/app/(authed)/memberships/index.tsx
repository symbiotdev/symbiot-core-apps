import { CurrentBrandMemberships } from '@symbiot-core-apps/brand-membership';
import { router } from 'expo-router';

export default () => (
  <CurrentBrandMemberships
    onMembershipPress={(membership) =>
      router.push(`/memberships/${membership.id}/profile`)
    }
  />
);
