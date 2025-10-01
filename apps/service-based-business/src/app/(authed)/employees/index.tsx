import { CurrentBrandEmployees } from '@symbiot-core-apps/brand-employee';
import { router } from 'expo-router';
import { useScreenHeaderHeight } from '@symbiot-core-apps/ui';

export default () => {
  const headerHeight = useScreenHeaderHeight();

  return (
    <CurrentBrandEmployees
      offsetTop={headerHeight}
      onEmployeePress={(employee) =>
        router.push(`/employees/${employee.id}/profile`)
      }
    />
  );
};
