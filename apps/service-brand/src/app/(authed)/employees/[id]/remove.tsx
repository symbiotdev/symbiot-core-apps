import { useLocalSearchParams } from 'expo-router';
import { useBrandEmployeeDetailedByIdReq } from '@symbiot-core-apps/api';
import { InitView } from '@symbiot-core-apps/ui';
import { RemoveBrandEmployee } from '@symbiot-core-apps/brand-employee';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: employee,
    error,
    isPending,
  } = useBrandEmployeeDetailedByIdReq(id, false);

  if (!employee || error) {
    return <InitView loading={isPending} error={error} />;
  }

  return <RemoveBrandEmployee employee={employee} />;
};
