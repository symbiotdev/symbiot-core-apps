import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { View } from 'tamagui';
import { Spinner } from '../loading/spinner';
import { PermissionStatus } from 'expo-image-picker';
import { SlideSheetModal } from '../modal/slide-sheet-modal';
import { Linking, useWindowDimensions } from 'react-native';
import { EmptyView } from '../view/empty-view';
import { Button } from '../button/button';
import { FormView } from '../view/form-view';
import { useTranslation } from 'react-i18next';

export const QrCodeScanModal = (props: {
  visible: boolean;
  onScan: (value: string) => void;
  onClose: () => void;
}) => {
  const onScan = useCallback(
    (value: string) => {
      props.onScan(value);
      props.onClose();
    },
    [props],
  );

  return (
    <SlideSheetModal {...props} paddingHorizontal={0} paddingVertical={0}>
      <Camera onScan={onScan} />
    </SlideSheetModal>
  );
};

const Camera = ({ onScan }: { onScan: (value: string) => void }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const scannedRef = useRef(false);

  const scanSize = useMemo(() => Math.min(width - 80, 400), [width]);

  const onBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (scannedRef.current) return;

      scannedRef.current = true;

      onScan(result.data);
    },
    [onScan],
  );

  useEffect(() => {
    void requestPermission();
  }, [requestPermission]);

  if (!permission) {
    return (
      <View
        justifyContent="center"
        alignItems="center"
        flex={1}
        backgroundColor="$background"
      ></View>
    );
  }

  return (
    <View
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor="$background"
      position="relative"
    >
      {permission?.status !== PermissionStatus.DENIED ? (
        <>
          <Spinner position="absolute" />

          <CameraView
            facing="back"
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={onBarcodeScanned}
          >
            <View
              position="absolute"
              borderWidth={2000}
              borderColor="#00000080"
              justifyContent="center"
              alignItems="center"
              borderRadius={2050}
            >
              <View width={scanSize} height={scanSize} />
            </View>
          </CameraView>
        </>
      ) : (
        <FormView flex={1}>
          <EmptyView
            iconName="Camera"
            title={t('shared.camera.denied_permission.title')}
            message={t('shared.camera.denied_permission.subtitle')}
          >
            <Button
              label={t('shared.camera.denied_permission.action.label')}
              onPress={Linking.openSettings}
            />
          </EmptyView>
        </FormView>
      )}
    </View>
  );
};
