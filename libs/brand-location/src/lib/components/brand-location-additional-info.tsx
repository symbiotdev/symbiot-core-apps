import {
  Icon,
  ListItem,
  SlideSheetModal,
  Textarea,
} from '@symbiot-core-apps/ui';
import { Controller, useForm } from 'react-hook-form';
import {
  BrandLocation,
  useUpdateBrandLocationQuery,
} from '@symbiot-core-apps/api';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCallback, useState } from 'react';
import { useBrandLocationForm } from '../hooks/use-brand-location-form';
import { useTranslation } from 'react-i18next';

export const BrandLocationAdditionalInfo = ({
  location,
}: {
  location: BrandLocation;
}) => {
  const { t } = useTranslation();
  const { mutateAsync: update } = useUpdateBrandLocationQuery();
  const form = useBrandLocationForm();

  const { control: remarkControl, handleSubmit: remarkHandleSubmit } = useForm<{
    remark: string;
  }>({
    defaultValues: {
      remark: location.remark || '',
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          remark: form.remark.optionalScheme,
        })
        .required(),
    ),
  });

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = useCallback(() => setModalVisible(true), []);
  const closeModal = useCallback(() => setModalVisible(false), []);

  const updateRemark = useCallback(
    ({ remark }: { remark: string }) => {
      remark !== location.remark &&
        update({
          id: location.id,
          data: {
            remark,
          },
        });
    },
    [location.remark, location.id, update],
  );

  return (
    <>
      <ListItem
        icon={<Icon name="InfoCircle" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={form.remark.title}
        text={location.remark || t('shared.not_specified')}
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={form.remark.title}
        visible={modalVisible}
        onClose={closeModal}
      >
        <Controller
          control={remarkControl}
          name="remark"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Textarea
              countCharacters
              enterKeyHint="done"
              value={value}
              error={error?.message}
              placeholder={form.remark.subtitle}
              onChange={onChange}
              onBlur={remarkHandleSubmit(updateRemark)}
            />
          )}
        />
      </SlideSheetModal>
    </>
  );
};
