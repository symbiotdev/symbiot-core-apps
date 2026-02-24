import { useLocalSearchParams } from 'expo-router';
import { useBrandEmployeeDetailedByIdReq } from '@symbiot-core-apps/api';
import { RemoveBrandEmployee } from '@symbiot-core-apps/brand-employee';
import { FallbackView } from '@symbiot-core-apps/ui2';

export default () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: employee,
    error,
    isPending,
  } = useBrandEmployeeDetailedByIdReq(id, false);

  if (!employee || error) {
    return <FallbackView loading={isPending} error={error} />;
  }

  return <RemoveBrandEmployee employee={employee} />;
};
