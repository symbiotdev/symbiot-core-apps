import {
  Button,
  EmptyView,
  Icon,
  Input,
  MediumText,
  PageView,
  QrCodeScanModal,
} from '@symbiot-core-apps/ui';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'tamagui';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { router } from 'expo-router';

export default () => {
  const { t } = useTranslation();

  const { control, handleSubmit } = useForm<{
    id: string;
  }>({
    defaultValues: {
      id: '',
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          id: yup
            .string()
            .required(
              t('brand.employees.upsert.intro.by_id.form.id.error.required'),
            ),
        })
        .required(),
    ),
  });

  const [scanQrVisible, setScanQrVisible] = useState<boolean>(false);

  const openScanQr = useCallback(() => setScanQrVisible(true), []);
  const closeScanQr = useCallback(() => setScanQrVisible(false), []);

  const create = useCallback(
    (id: string) => router.push(`/employees/${id}/create`),
    [],
  );

  const onAdd = useCallback(
    async ({ id }: { id: string }) => create(id),
    [create],
  );

  return (
    <>
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
          title={t('brand.employees.upsert.intro.title')}
          message={t('brand.employees.upsert.intro.subtitle')}
        >
          <View />

          <Controller
            control={control}
            name="id"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Input
                value={value}
                error={error?.message}
                label={t('brand.employees.upsert.intro.by_id.form.id.label')}
                placeholder={t(
                  'brand.employees.upsert.intro.by_id.form.id.placeholder',
                )}
                onChange={onChange}
              />
            )}
          />

          <Button
            label={t('brand.employees.upsert.intro.by_id.action.label')}
            onPress={handleSubmit(onAdd)}
          />

          <MediumText>{t('shared.or')}</MediumText>

          <Button
            icon={<Icon name="QrCode" />}
            label={t('brand.employees.upsert.intro.qr.action.label')}
            onPress={openScanQr}
          />
        </EmptyView>
      </PageView>

      <QrCodeScanModal
        onScan={create}
        visible={scanQrVisible}
        onClose={closeScanQr}
      />
    </>
  );
};
