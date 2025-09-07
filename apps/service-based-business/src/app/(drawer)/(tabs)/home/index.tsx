import { H2, PageView } from '@symbiot-core-apps/ui';
import { useCurrentBrandEmployee } from '@symbiot-core-apps/state';
import { View } from 'tamagui';

export default () => {
  const { currentEmployee } = useCurrentBrandEmployee();

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
