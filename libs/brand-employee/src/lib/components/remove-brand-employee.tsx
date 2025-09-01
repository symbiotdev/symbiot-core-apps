import { ActionCard, FormView, Icon, PageView } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { ConfirmAlert } from '@symbiot-core-apps/shared';
import {
  BrandEmployee,
  useRemoveBrandEmployeeQuery,
} from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

export const RemoveBrandEmployee = ({
  employee,
}: {
  employee: BrandEmployee;
}) => {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useRemoveBrandEmployeeQuery();

  const onActionPress = useCallback(
    () =>
      ConfirmAlert({
        title: t('brand.employees.remove.confirm_dialog.title'),
        message: t('brand.employees.remove.confirm_dialog.message'),
        callback: async () => {
          await mutateAsync({ id: employee.id });

          router.dismissTo('/brand/menu/employees');
        },
      }),
    [employee.id, mutateAsync, t],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView>
        <ActionCard
          title={t('brand.employees.remove.title')}
          subtitle={t('brand.employees.remove.subtitle', {
            name: employee.name,
          })}
          buttonLabel={t('brand.employees.remove.button.label')}
          buttonIcon={<Icon name="TrashBinMinimalistic" />}
          buttonLoading={isPending}
          buttonType="danger"
          onActionPress={onActionPress}
        />
      </FormView>
    </PageView>
  );
};
