import { ViewProps } from 'tamagui';
import { FormField } from './form-field';
import { DocumentPickerAsset, getDocumentAsync } from 'expo-document-picker';
import { useCallback, useState } from 'react';
import { emitHaptic, ShowNativeFailedAlert } from '@symbiot-core-apps/shared';
import { useTranslation } from 'react-i18next';
import { Button } from '../button/button';

export const DocumentPicker = ({
  type,
  label,
  error,
  disabled,
  multiple,
  onUpload,
  ...viewProps
}: ViewProps & {
  disabled?: boolean;
  multiple?: boolean;
  label?: string;
  error?: string;
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
    <FormField label={label} error={error} {...viewProps}>
      <Button
        label={label || t('shared.upload')}
        loading={uploading}
        onPress={upload}
      />
    </FormField>
  );
};
