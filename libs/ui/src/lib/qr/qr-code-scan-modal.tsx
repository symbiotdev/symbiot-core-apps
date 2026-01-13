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
import { Linking, StyleSheet, useWindowDimensions } from 'react-native';
import { EmptyView } from '../view/empty-view';
import { Button } from '../button/button';
import { FormView } from '../view/form-view';
import { useTranslation } from 'react-i18next';
import { useRendered } from '@symbiot-core-apps/shared';
import { LoadingView } from '../view/loading-view';

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
    <SlideSheetModal
      {...props}
      transparentHeader
      ignoreBottomSafeArea
      withKeyboard={false}
      paddingTop={0}
      paddingLeft={0}
      paddingRight={0}
      paddingBottom={0}
    >
      <Camera onScan={onScan} />
    </SlideSheetModal>
  );
};

const Camera = ({ onScan }: { onScan: (value: string) => void }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { rendered } = useRendered({ delay: 200 });

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
    if (rendered && !permission?.granted) {
      void requestPermission();
    }
  }, [permission?.granted, rendered, requestPermission]);

  if (!rendered) {
    return <LoadingView />;
  }

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

  if (permission?.status !== PermissionStatus.DENIED) {
    return (
      <>
        <Spinner position="absolute" />

        <CameraView
          facing="back"
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: 'center',
            alignItems: 'center',
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
    );
  } else {
    return (
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
    );
  }
};
