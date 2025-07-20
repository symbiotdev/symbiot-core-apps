import { useTheme, View } from 'tamagui';
import { QrCodeSvg } from 'react-native-qr-svg';
import { ReactElement } from 'react';

export const QrCode = ({
  value,
  size,
  content,
}: {
  value: string;
  size: number;
  content?: ReactElement;
}) => {
  const theme = useTheme();

  return (
    <QrCodeSvg
      gradientColors={[
        theme.qrCodeGradientFrom?.val,
        theme.qrCodeGradientTo?.val,
      ]}
      content={content && <View margin="auto">{content}</View>}
      contentCells={5}
      value={value}
      frameSize={size}
      dotColor={theme.qrCode?.val}
      backgroundColor="transparent"
    />
  );
};
