import { memo, ReactElement } from 'react';
import { AdaptiveSheet } from '../sheet/adaptive-sheet';
import { QrCode } from './qr-code';
import { ScrollView, View } from 'react-native';

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
      <ScrollView>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 25
          }}
        >
          <QrCode size={qrSize} value={qrValue} content={qrContent} />
        </View>
      </ScrollView>
    </AdaptiveSheet>
  ),
);
