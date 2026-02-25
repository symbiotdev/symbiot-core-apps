import { memo, ReactElement } from 'react';
import { AdaptiveSheet } from '../sheet/adaptive-sheet';
import { QrCode } from './qr-code';
import { View } from 'react-native';

export const QrCodeSheet = memo(
  ({
    title,
    qrSize = 200,
    trigger,
    qrValue,
    qrContent,
  }: {
    title?: string;
    qrSize?: number;
    qrValue: string;
    trigger: ReactElement;
    qrContent?: ReactElement;
  }) => (
    <AdaptiveSheet sheetTitle={title} trigger={trigger}>
      <View
        style={{
          minHeight: 300,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <QrCode size={qrSize} value={qrValue} content={qrContent} />
      </View>
    </AdaptiveSheet>
  ),
);
