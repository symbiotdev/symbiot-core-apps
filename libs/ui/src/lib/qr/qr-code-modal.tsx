import { Platform, StyleSheet } from 'react-native';
import { BaseSyntheticEvent, ReactElement } from 'react';
import { PageView } from '../view/page-view';
import { QrCode } from './qr-code';
import { Card } from '../card/card';
import { H4 } from '../text/heading';
import { Blur } from '../blur/blur';
import { emitHaptic, useModal } from '@symbiot-core-apps/shared';
import { FullScreenTransparentModal } from '../modal/full-screen-transparent-modal';
import { View } from 'tamagui';

export const QrCodeModalWithTrigger = ({
  trigger,
  qrSize,
  qrValue,
  qrContent,
  title,
}: {
  trigger: ReactElement;
  qrValue: string;
  qrSize?: number;
  qrContent?: ReactElement;
  title?: string;
}) => {
  const { visible, open, close } = useModal({
    onOpen: emitHaptic,
    onClose: emitHaptic,
  });
  return (
    <>
      <View cursor="pointer" onPress={open}>
        {trigger}
      </View>

      <QrCodeModal
        visible={visible}
        qrSize={qrSize}
        qrValue={qrValue}
        qrContent={qrContent}
        title={title}
        onClose={close}
      />
    </>
  );
};

export const QrCodeModal = ({
  visible,
  qrSize = 200,
  qrValue,
  qrContent,
  title,
  onClose,
}: {
  visible: boolean;
  qrValue: string;
  qrSize?: number;
  qrContent?: ReactElement;
  title?: string;
  onClose: (e: BaseSyntheticEvent) => void;
}) => {
  return (
    <FullScreenTransparentModal
      visible={visible}
      animationType={Platform.OS === 'android' ? 'fade' : 'slide'}
      onClose={onClose}
    >
      <Blur style={StyleSheet.absoluteFillObject} />

      <PageView onPress={onClose}>
        <Card
          borderWidth={1}
          borderColor="$background"
          margin="auto"
          gap="$4"
          alignItems="center"
        >
          <QrCode size={qrSize} value={qrValue} content={qrContent} />

          {!!title && (
            <H4 textAlign="center" maxWidth={qrSize}>
              {title}
            </H4>
          )}
        </Card>
      </PageView>
    </FullScreenTransparentModal>
  );
};
