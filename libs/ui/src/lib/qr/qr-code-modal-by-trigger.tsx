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

export const QrCodeModalByTrigger = ({
  trigger,
  qrSize,
  qrValue,
  qrContent,
  title,
}: {
  trigger: ReactElement;
  qrSize: number;
  qrValue: string;
  qrContent?: ReactElement;
  title?: string;
}) => {
  const [visible, setVisible] = useState(false);

  const onOpen = useCallback(() => setVisible(true), []);
  const onClose = useCallback(() => setVisible(false), []);

  return (
    <>
      <TouchableWithoutFeedback onPress={onOpen}>
        {trigger}
      </TouchableWithoutFeedback>

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
    </>
  );
};
