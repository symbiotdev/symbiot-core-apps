import { useForm } from 'react-hook-form';
import { BrandNewEmployeeIdController } from '../controller/brand-new-employee-id-controller';
import {
  Button,
  Icon,
  MediumText,
  QrCodeScanModal,
} from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';

type FormValue = {
  id: string;
};

export const BrandNewEmployeeIdForm = ({
  onAdd,
}: {
  onAdd: (value: FormValue) => void;
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<FormValue>({
    defaultValues: {
      id: '',
    },
  });

  const [scanQrVisible, setScanQrVisible] = useState<boolean>(false);

  const openScanQr = useCallback(() => setScanQrVisible(true), []);
  const closeScanQr = useCallback(() => setScanQrVisible(false), []);
  const onScan = useCallback((id: string) => onAdd({ id }), [onAdd]);

  return (
    <>
      <BrandNewEmployeeIdController name="id" control={control} />

      <Button
        label={t('brand_employee.create.intro.by_id.action.label')}
        onPress={handleSubmit(onAdd)}
      />

      <MediumText>{t('shared.or')}</MediumText>

      <Button
        icon={<Icon name="QrCode" />}
        label={t('brand_employee.create.intro.qr.action.label')}
        onPress={openScanQr}
      />

      <QrCodeScanModal
        onScan={onScan}
        visible={scanQrVisible}
        onClose={closeScanQr}
      />
    </>
  );
};
