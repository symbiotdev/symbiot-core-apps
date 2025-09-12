import { View, ViewProps } from 'tamagui';
import { FormField } from './form-field';
import { DocumentPickerAsset, getDocumentAsync } from 'expo-document-picker';
import { useCallback, useState } from 'react';
import { emitHaptic, ShowNativeFailedAlert } from '@symbiot-core-apps/shared';
import { LoadingView } from '../view/loading-view';
import { MediumText } from '../text/text';
import { useTranslation } from 'react-i18next';
import { Icon } from '../icons';

export const DocumentPicker = ({
  type,
  label,
  error,
  uploadLabel,
  disabled,
  multiple,
  onUpload,
  ...viewProps
}: ViewProps & {
  disabled?: boolean;
  multiple?: boolean;
  label?: string;
  error?: string;
  uploadLabel?: string;
  type: string[];
  onUpload: (data: DocumentPickerAsset[]) => unknown;
}) => {
  const { t } = useTranslation();

  const [uploading, setUploading] = useState(false);

  const upload = useCallback(async () => {
    if (disabled) {
      return;
    }

    emitHaptic();

    setUploading(true);

    try {
      const result = await getDocumentAsync({
        type,
        multiple,
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets.length) {
        return;
      }

      onUpload(result.assets);
    } catch (error) {
      ShowNativeFailedAlert({
        text: error as string,
      });
    } finally {
      setUploading(false);
    }
  }, [disabled, multiple, onUpload, type]);

  return (
    <FormField label={label} error={error}>
      <View
        borderRadius="$10"
        backgroundColor="$background1"
        width="100%"
        height={100}
        position="relative"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        {...viewProps}
      >
        {uploading ? (
          <LoadingView
            position="absolute"
            zIndex={1}
            height="100%"
            width="100%"
          />
        ) : (
          <View
            disabled={disabled}
            alignItems="center"
            gap="$2"
            justifyContent="center"
            width="100%"
            padding="$5"
            cursor="pointer"
            height="100%"
            pressStyle={{ opacity: 0.8 }}
            onPress={upload}
          >
            <Icon name="Import" />
            <MediumText>{uploadLabel || t('shared.upload')}</MediumText>
          </View>
        )}
      </View>
    </FormField>
  );
};
