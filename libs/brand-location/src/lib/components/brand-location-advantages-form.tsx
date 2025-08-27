import {
  Icon,
  InitView,
  ListItem,
  SlideSheetModal,
  ToggleGroup,
  ToggleOnChange,
} from '@symbiot-core-apps/ui';
import { useBrandLocationForm } from '../hooks/use-brand-location-form';
import { useTranslation } from 'react-i18next';
import {
  BrandLocation,
  useUpdateBrandLocationQuery,
} from '@symbiot-core-apps/api';
import { useCallback, useMemo, useState } from 'react';
import { arraysOfObjectsEqual } from '@symbiot-core-apps/shared';
import { useBrandLocationAdvantageOptions } from '../hooks/use-brand-location-advantage-options';

export const BrandLocationAdvantagesForm = ({
  location,
}: {
  location: BrandLocation;
}) => {
  const { t } = useTranslation();
  const form = useBrandLocationForm();
  const { mutateAsync: updateLocation } = useUpdateBrandLocationQuery();
  const { advantages, advantagesLoading, advantagesError } =
    useBrandLocationAdvantageOptions();

  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState(location.advantages);

  const hasChanges = useMemo(
    () => !arraysOfObjectsEqual(location.advantages, value),
    [location.advantages, value],
  );

  const openModal = useCallback(() => setModalVisible(true), []);
  const closeModal = useCallback(async () => {
    setModalVisible(false);

    if (hasChanges) {
      try {
        await updateLocation({
          id: location.id,
          data: {
            advantages: value.map(({ id }) => id),
          },
        });
      } catch {
        setValue(location.advantages);

        setTimeout(openModal, 500);
      }
    }
  }, [
    location.advantages,
    location.id,
    hasChanges,
    openModal,
    updateLocation,
    value,
  ]);

  return (
    <>
      <ListItem
        icon={<Icon name="ChecklistMinimalistic" />}
        iconAfter={<Icon name="ArrowRight" />}
        label={form.advantages.title}
        text={
          value.map(({ name }) => name).join(', ') || t('shared.not_specified')
        }
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={form.advantages.title}
        visible={modalVisible}
        onClose={closeModal}
      >
        {!advantages?.length ? (
          <InitView loading={advantagesLoading} error={advantagesError} />
        ) : (
          <ToggleGroup
            multiselect
            allowEmpty
            value={value}
            items={advantages}
            onChange={setValue as ToggleOnChange}
          />
        )}
      </SlideSheetModal>
    </>
  );
};
