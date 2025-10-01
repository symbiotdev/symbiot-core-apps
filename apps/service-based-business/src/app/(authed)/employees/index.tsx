import { CurrentBrandEmployees } from '@symbiot-core-apps/brand-employee';
import { router } from 'expo-router';

export default () => (
  <CurrentBrandEmployees
    onEmployeePress={(employee) => router.push(`/employees/${employee.id}/profile`)}
  />
);
