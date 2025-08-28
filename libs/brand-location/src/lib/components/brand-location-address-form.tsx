import {
  defaultPageVerticalPadding,
  FormView,
  Icon,
  Input,
  ListItem,
  SlideSheetModal, Textarea
} from '@symbiot-core-apps/ui';
import { useCallback, useState } from 'react';
import { useBrandLocationForm } from '../hooks/use-brand-location-form';
import { AddressPicker } from '@symbiot-core-apps/location';
import { useTranslation } from 'react-i18next';
import {
  BrandLocation,
  useUpdateBrandLocationQuery,
} from '@symbiot-core-apps/api';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export const BrandLocationAddressForm = ({
  location,
}: {
  location: BrandLocation;
}) => {
  const { t } = useTranslation();
  const form = useBrandLocationForm();
  const { mutateAsync: update } = useUpdateBrandLocationQuery();

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = useCallback(() => setModalVisible(true), []);
  const closeModal = useCallback(() => setModalVisible(false), []);

  const { control: addressControl, handleSubmit: addressHandleSubmit } =
    useForm<{
      address: string;
    }>({
      defaultValues: {
        address: location.address || '',
      },
      resolver: yupResolver(
        yup
          .object()
          .shape({
            address: form.address.scheme,
          })
          .required(),
      ),
    });

  const updateAddress = useCallback(
    ({ address }: { address: string }) =>
      location.address !== address &&
      update({
        id: location.id,
        data: {
          address,
        },
      }),
    [location.address, location.id, update],
  );

  const { control: entranceControl, handleSubmit: entranceHandleSubmit } =
    useForm<{
      entrance: string;
    }>({
      defaultValues: {
        entrance: location.entrance || '',
      },
      resolver: yupResolver(
        yup
          .object()
          .shape({
            entrance: form.entrance.scheme,
          })
          .required(),
      ),
    });

  const updateEntrance = useCallback(
    ({ entrance }: { entrance: string }) =>
      location.entrance !== entrance &&
      update({
        id: location.id,
        data: {
          entrance,
        },
      }),
    [location.entrance, location.id, update],
  );

  const { control: floorControl, handleSubmit: floorHandleSubmit } = useForm<{
    floor: string;
  }>({
    defaultValues: {
      floor: location.floor || '',
    },
    resolver: yupResolver(
      yup
        .object()
        .shape({
          floor: form.floor.scheme,
        })
        .required(),
    ),
  });

  const updateFloor = useCallback(
    ({ floor }: { floor: string }) =>
      location.floor !== floor &&
      update({
        id: location.id,
        data: {
          floor,
        },
      }),
    [location.floor, location.id, update],
  );

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
        icon={<Icon name="MapPoint" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={form.address.title}
        text={
          [location.address, location.entrance, location.floor]
            .filter(Boolean)
            .join(' · ') || t('shared.not_specified')
        }
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={form.address.title}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FormView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <Controller
            control={addressControl}
            name="address"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <AddressPicker
                value={value}
                label={form.address.label}
                placeholder={form.address.placeholder}
                error={error?.message}
                onChange={onChange}
                onBlur={addressHandleSubmit(updateAddress)}
              />
            )}
          />

          <Controller
            control={entranceControl}
            name="entrance"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Input
                value={value}
                maxLength={64}
                label={form.entrance.label}
                placeholder={form.entrance.placeholder}
                error={error?.message}
                onChange={onChange}
                onBlur={entranceHandleSubmit(updateEntrance)}
              />
            )}
          />

          <Controller
            control={floorControl}
            name="floor"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Input
                keyboardType="numeric"
                regex={/\d+/}
                value={value}
                maxLength={64}
                label={form.floor.label}
                placeholder={form.floor.placeholder}
                error={error?.message}
                onChange={onChange}
                onBlur={floorHandleSubmit(updateFloor)}
              />
            )}
          />

          <Controller
            control={remarkControl}
            name="remark"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Textarea
                countCharacters
                enterKeyHint="done"
                value={value}
                error={error?.message}
                label={form.remark.title}
                placeholder={form.remark.subtitle}
                onChange={onChange}
                onBlur={remarkHandleSubmit(updateRemark)}
              />
            )}
          />
        </FormView>
      </SlideSheetModal>
    </>
  );
};
