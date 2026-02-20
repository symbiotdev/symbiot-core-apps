import { EmptyView } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { View } from 'tamagui';
import { router } from 'expo-router';
import { BrandNewEmployeeIdForm } from './form/brand-new-employee-id-form';
import { useI18n } from '@symbiot-core-apps/shared';
import { ScrollablePage } from '@symbiot-core-apps/ui2';

export const NewBrandEmployee = () => {
  const { t } = useI18n();

  const onAdd = useCallback(
    ({ id }: { id: string }) => router.push(`/employees/${id}/create`),
    [],
  );

  return (
    <ScrollablePage withKeyboard>
      <EmptyView
        padding={0}
        iconName="UsersGroupRounded"
        title={t('brand_employee.create.intro.title')}
        message={t('brand_employee.create.intro.subtitle')}
      >
        <View />

        <BrandNewEmployeeIdForm onAdd={onAdd} />
      </EmptyView>
    </ScrollablePage>
  );
};
