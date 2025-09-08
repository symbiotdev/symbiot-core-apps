import { H2, PageView } from '@symbiot-core-apps/ui';
import {
  useCurrentBrandEmployee,
  useCurrentBrandState,
} from '@symbiot-core-apps/state';
import { View } from 'tamagui';
import { InitialAction } from '../../../components/brand/initial-action';

export default () => {
  const { currentEmployee } = useCurrentBrandEmployee();
  const { brand: currentBrand } = useCurrentBrandState();

  if (!currentBrand) {
    return <InitialAction />;
  }

  return (
    currentEmployee && (
      <PageView>
        <View gap={20} margin="auto">
          <H2 textAlign="center">{currentEmployee.name}</H2>
        </View>
      </PageView>
    )
  );
};
