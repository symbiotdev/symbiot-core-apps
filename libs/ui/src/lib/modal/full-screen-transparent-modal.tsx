import { Modal, ModalProps } from 'react-native';
import { BaseSyntheticEvent, PropsWithChildren } from 'react';

export const FullScreenTransparentModal = ({
  children,
  onClose,
  ...modalProps
}: PropsWithChildren<
  ModalProps & {
    visible: boolean;
    onClose: (e: BaseSyntheticEvent) => void;
  }
>) => (
  <Modal
    transparent
    animationType="none"
    presentationStyle="overFullScreen"
    supportedOrientations={['portrait', 'landscape']}
    onRequestClose={onClose}
    {...modalProps}
  >
    {children}
  </Modal>
);
