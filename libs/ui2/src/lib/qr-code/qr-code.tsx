import { memo, ReactElement } from 'react';
import { View } from 'tamagui';
import { QrCodeSvg } from 'react-native-qr-svg';
import { useAppScheme } from '@symbiot-core-apps/state';

// fixme - colorize
export const QrCode = memo(
  ({
    value,
    size,
    content,
  }: {
    value: string;
    size: number;
    content?: ReactElement;
  }) => {
    const { scheme } = useAppScheme();

    return (
      <QrCodeSvg
        gradientColors={
          scheme === 'dark' ? ['#FFFFFF', '#FAFAFA'] : ['#000000', '#111111']
        }
        content={content && <View margin="auto">{content}</View>}
        contentCells={5}
        value={String(value)}
        frameSize={size}
        dotColor={scheme === 'dark' ? '#FFFFFF' : '#000000'}
        backgroundColor="transparent"
      />
    );
  },
);
