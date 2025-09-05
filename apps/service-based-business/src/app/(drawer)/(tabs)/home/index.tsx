import { H2, PageView } from '@symbiot-core-apps/ui';
import { useCurrentBrandEmployeeState } from '@symbiot-core-apps/state';

export default () => {
  const { currentEmployee } = useCurrentBrandEmployeeState();

  return (
    currentEmployee && (
      <PageView>
        <H2 margin="auto" textAlign="center">
          {currentEmployee.name}
        </H2>
      </PageView>
    )
  );
};
