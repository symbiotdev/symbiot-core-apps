import { Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { ReactElement, useCallback, useState } from 'react';
import { BlurView } from 'expo-blur';
import { useSystemScheme } from '@symbiot-core-apps/shared';
import { PageView } from '../view/page-view';
import { QrCode } from './qr-code';
import { Card } from '../card/card';
import { H2 } from '../text/heading';

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
  const scheme = useSystemScheme();

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
        animationType="slide"
        presentationStyle="overFullScreen"
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={onClose}
      >
        <BlurView
          intensity={30}
          tint={scheme}
          style={StyleSheet.absoluteFillObject}
        />

        <PageView viewProps={{ onPress: onClose }}>
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
