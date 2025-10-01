import { CurrentBrandMemberships } from '@symbiot-core-apps/brand-membership';
import { router } from 'expo-router';
import { useScreenHeaderHeight } from '@symbiot-core-apps/ui';

export default () => {
  const headerHeight = useScreenHeaderHeight();

  return (
    <CurrentBrandMemberships
      offsetTop={headerHeight}
      onMembershipPress={(membership) =>
        router.push(`/memberships/${membership.id}/profile`)
      }
    />
  );
};
