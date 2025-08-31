import {
  getCurrentPositionAsync,
  LocationObjectCoords,
  PermissionStatus,
  requestForegroundPermissionsAsync,
} from 'expo-location';
import {
  Button,
  EmptyView,
  FormView,
  Icon,
  Input,
  MediumText,
  onChangeInput,
  SlideSheetModal,
  Spinner,
} from '@symbiot-core-apps/ui';
import { useCallback, useRef, useState } from 'react';
import { useLocationReverseQuery } from '@symbiot-core-apps/api';
import { View, XStack } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { Linking, TextInputProps } from 'react-native';
import { emitHaptic } from '@symbiot-core-apps/shared';

export const AddressPicker = ({
  onChange,
  onBlur,
  ...inputProps
}: {
  value: string;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  enterKeyHint?: TextInputProps['enterKeyHint'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  onChange?: onChangeInput;
  onBlur?: () => void;
}) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [permissionDeniedModalVisible, setPermissionDeniedModalVisible] =
    useState(false);

  const myLocationRef = useRef<{
    coords: LocationObjectCoords;
    address: string;
  }>(null);

  const { mutateAsync } = useLocationReverseQuery();

  const openDeniedPermissionModal = useCallback(
    () => setPermissionDeniedModalVisible(true),
    [],
  );

  const closeDeniedPermissionModal = useCallback(
    () => setPermissionDeniedModalVisible(false),
    [],
  );

  const onPress = useCallback(async () => {
    emitHaptic();

    setLoading(true);

    try {
      const { status } = await requestForegroundPermissionsAsync();

      if (status === PermissionStatus.DENIED) {
        openDeniedPermissionModal();
      } else {
        if (status === PermissionStatus.GRANTED) {
          const { coords } = await getCurrentPositionAsync();

          if (myLocationRef.current) {
          } else {
            const { address } = await mutateAsync(coords);

            myLocationRef.current = {
              coords,
              address,
            };
          }

          onChange?.(myLocationRef.current.address);
          onBlur?.();
        }
      }
    } finally {
      setLoading(false);
    }
  }, [openDeniedPermissionModal, mutateAsync, onChange, onBlur]);

  return (
    <>
      <View gap="$2">
        <Input
          {...inputProps}
          type="text"
          keyboardType="default"
          disabled={inputProps.disabled || loading}
          onChange={onChange}
          onBlur={onBlur}
        />

        <XStack
          alignItems="center"
          gap="$2"
          paddingHorizontal="$2"
          disabled={loading}
          pressStyle={{ opacity: 0.8 }}
          onPress={onPress}
        >
          {loading ? (
            <Spinner size="small" />
          ) : (
            <Icon name="MapPoint" size={16} />
          )}

          <MediumText fontSize={12} flex={1} numberOfLines={1}>
            {t('shared.location.current')}
          </MediumText>
        </XStack>
      </View>

      <SlideSheetModal
        visible={permissionDeniedModalVisible}
        onClose={closeDeniedPermissionModal}
      >
        <FormView flex={1}>
          <EmptyView
            iconName="MapPointWave"
            title={t('shared.location.denied_permission.title')}
            message={t('shared.location.denied_permission.subtitle')}
          >
            <Button
              label={t('shared.location.denied_permission.action.label')}
              onPress={Linking.openSettings}
            />
          </EmptyView>
        </FormView>
      </SlideSheetModal>
    </>
  );
};
