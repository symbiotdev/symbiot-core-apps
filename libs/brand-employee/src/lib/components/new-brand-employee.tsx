import { EmptyView, PageView } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'tamagui';
import { router } from 'expo-router';
import { BrandNewEmployeeIdForm } from './form/brand-new-employee-id-form';

export const NewBrandEmployee = () => {
  const { t } = useTranslation();

  const onAdd = useCallback(
    ({ id }: { id: string }) => router.push(`/employees/${id}/create`),
    [],
  );

  return (
    <PageView
      scrollable
      withKeyboard
      withHeaderHeight
      animation="medium"
      opacity={1}
      enterStyle={{ opacity: 0 }}
      exitStyle={{ opacity: 0 }}
    >
      <EmptyView
        padding={0}
        iconName="UsersGroupRounded"
        title={t('brand_employee.create.intro.title')}
        message={t('brand_employee.create.intro.subtitle')}
      >
        <View />

        <BrandNewEmployeeIdForm onAdd={onAdd} />
      </EmptyView>
    </PageView>
  );
};
