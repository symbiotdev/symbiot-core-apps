import { DocumentPickerAsset, getDocumentAsync } from 'expo-document-picker';
import { useCallback, useState } from 'react';
import {
  emitHaptic,
  ShowNativeFailedAlert,
  useI18n,
} from '@symbiot-core-apps/shared';
import { ViewProps } from 'tamagui';
import { FormField } from '../wrapper/form-field';
import { Button } from '@symbiot-core-apps/ui';

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
  const { t } = useI18n();

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
    <FormField error={error} {...viewProps}>
      <Button
        label={label || t('shared.upload')}
        loading={uploading}
        onPress={upload}
      />
    </FormField>
  );
};
