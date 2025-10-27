import { ActionCard, FormView, Icon, PageView } from '@symbiot-core-apps/ui';
import { useCallback } from 'react';
import { ConfirmAlert } from '@symbiot-core-apps/shared';
import {
  BrandEmployee,
  useRemoveBrandEmployeeReq,
} from '@symbiot-core-apps/api';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

export const RemoveBrandEmployee = ({
  employee,
}: {
  employee: BrandEmployee;
}) => {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useRemoveBrandEmployeeReq();

  const onPress = useCallback(
    () =>
      ConfirmAlert({
        title: t('brand_employee.remove.confirm_dialog.title'),
        message: t('brand_employee.remove.confirm_dialog.message'),
        callback: async () => {
          await mutateAsync({ id: employee.id });

          router.dismissAll()
          router.push('/employees');
        },
      }),
    [employee.id, mutateAsync, t],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView>
        <ActionCard
          title={t('brand_employee.remove.title')}
          subtitle={t('brand_employee.remove.subtitle', {
            name: employee.name,
          })}
          buttonLabel={t('brand_employee.remove.button.label')}
          buttonIcon={<Icon name="TrashBinMinimalistic" />}
          buttonLoading={isPending}
          buttonType="danger"
          onPress={onPress}
        />
      </FormView>
    </PageView>
  );
};
