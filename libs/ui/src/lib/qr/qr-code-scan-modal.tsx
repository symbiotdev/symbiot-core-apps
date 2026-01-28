import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { View } from 'tamagui';
import { PermissionStatus } from 'expo-image-picker';
import { SlideSheetModal } from '../modal/slide-sheet-modal';
import {
  Linking,
  Platform,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { EmptyView } from '../view/empty-view';
import { Button } from '../button/button';
import { CompactView } from '../view/compact-view';
import { useI18n, useRendered } from '@symbiot-core-apps/shared';
import { LoadingView } from '../view/loading-view';
import { headerHeight } from '../navigation/header';
import { Spinner } from '../loading/spinner';
import Svg, { Mask, Rect } from 'react-native-svg';

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
  const { t } = useI18n();
  const { width, height } = useWindowDimensions();
  const { rendered } = useRendered({ delay: 200 });

  const scannedRef = useRef(false);

  const { frameSize, frameX, frameY, frameRadius } = useMemo(() => {
    const size = Math.min(Math.min(width, height) - 80, 400);

    return {
      frameSize: size,
      frameX: (width - size) / 2,
      frameY: (height - size) / 2 - (Platform.OS === 'ios' ? headerHeight : 0),
      frameRadius: 50,
    };
  }, [width, height]);

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

  if (permission?.status === PermissionStatus.DENIED) {
    return (
      <CompactView flex={1}>
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
      </CompactView>
    );
  } else {
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
          <Svg width={width} height={height}>
            <Mask id="mask">
              <Rect width="100%" height="100%" fill="white" />
              <Rect
                x={frameX}
                y={frameY}
                width={frameSize}
                height={frameSize}
                rx={frameRadius}
                ry={frameRadius}
                fill="black"
              />
            </Mask>

            <Rect
              width="100%"
              height="100%"
              fill="rgba(0,0,0,0.7)"
              mask="url(#mask)"
            />

            <Rect
              x={frameX}
              y={frameY}
              width={frameSize}
              height={frameSize}
              rx={frameRadius}
              ry={frameRadius}
              stroke="#FFFFFF50"
              strokeWidth={2}
              fill="transparent"
            />
          </Svg>
        </CameraView>
      </>
    );
  }
};
