import {
  Modal,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { ReactElement, useCallback, useState } from 'react';
import { PageView } from '../view/page-view';
import { QrCode } from './qr-code';
import { Card } from '../card/card';
import { H2 } from '../text/heading';
import { Blur } from '../blur/blur';
import { emitHaptic } from '@symbiot-core-apps/shared';

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
  const [visible, setVisible] = useState(false);

  const onOpen = useCallback(() => {
    emitHaptic();
    setVisible(true);
  }, []);
  const onClose = useCallback(() => {
    emitHaptic();
    setVisible(false);
  }, []);

  return (
    <>
      <TouchableWithoutFeedback onPress={onOpen}>
        {trigger}
      </TouchableWithoutFeedback>

      <QrCodeModal
        visible={visible}
        qrSize={qrSize}
        qrValue={qrValue}
        qrContent={qrContent}
        title={title}
        onClose={onClose}
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
  onClose: () => void;
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType={Platform.OS === 'android' ? 'fade' : 'slide'}
      presentationStyle="overFullScreen"
      supportedOrientations={['portrait', 'landscape']}
      onRequestClose={onClose}
    >
      <Blur style={StyleSheet.absoluteFillObject} />

      <PageView onPress={onClose}>
        <Card
          margin="auto"
          gap="$3"
          borderWidth={1}
          borderColor="$background"
          alignItems="center"
        >
          <QrCode size={qrSize} value={qrValue} content={qrContent} />

          {!!title && (
            <H2 textAlign="center" maxWidth={qrSize}>
              {title}
            </H2>
          )}
        </Card>
      </PageView>
    </Modal>
  );
};
