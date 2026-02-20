import { BaseSyntheticEvent, ReactElement } from 'react';
import { QrCode } from './qr-code';
import { Card } from '../card/card';
import { H4 } from '../text/heading';
import { emitHaptic, useModal } from '@symbiot-core-apps/shared';
import { FullScreenTransparentModal } from '../modal/full-screen-transparent-modal';
import { View } from 'tamagui';
import { Pressable, StyleSheet } from 'react-native';
import { GlassLikeView } from '@symbiot-core-apps/ui2';

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
      animationType="fade"
      onClose={onClose}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <GlassLikeView style={StyleSheet.absoluteFill} />
      </Pressable>

      <Card
        margin="auto"
        gap="$4"
        alignItems="center"
        zIndex={1}
        borderWidth={1}
        borderColor="#FFFFFF20"
        boxShadow="0 0 25px rgba(0, 0, 0, 0.15)"
      >
        <QrCode size={qrSize} value={qrValue} content={qrContent} />

        {!!title && (
          <H4 textAlign="center" maxWidth={qrSize}>
            {title}
          </H4>
        )}
      </Card>
    </FullScreenTransparentModal>
  );
};
