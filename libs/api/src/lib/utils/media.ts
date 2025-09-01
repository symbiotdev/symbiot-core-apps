import { ImagePickerAsset } from 'expo-image-picker';
import { Platform } from 'react-native';

export type UploadingFile = {
  uri: string;
  name: string;
  type: string;
};

export const convertImagePickerAssetToUploadingFile = (
  asset: ImagePickerAsset,
): UploadingFile => ({
  uri: asset.uri,
  name: generateUploadingFile(asset.fileName, asset.assetId),
  type: asset.mimeType || 'unknown',
});

export async function generateFormData<D extends object>(
  data: D,
  fileKeys: (keyof D)[],
) {
  const formData = new FormData();

  await Promise.all(
    Object.keys(data).map(async (key) => {
      const value = data[key as keyof D] as unknown;

      if (!value) return;

      if (fileKeys.includes(key as keyof D)) {
        if (Array.isArray(value)) {
          await Promise.all(
            value
              .map(convertImagePickerAssetToUploadingFile)
              .map((file) => appendFindToFormData(formData, key, file)),
          );
        } else {
          await appendFindToFormData(
            formData,
            key,
            convertImagePickerAssetToUploadingFile(value as ImagePickerAsset),
          );
        }
      } else {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(
              `${key}[]`,
              typeof item === 'object' ? JSON.stringify(item) : item,
            );
          });
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      }
    }),
  );

  return formData;
}

const appendFindToFormData = async (
  formData: FormData,
  key: string,
  file: UploadingFile,
) => {
  if (Platform.OS === 'web') {
    const blob = await fetch(file.uri);

    formData.append(key, await blob.blob());
  } else {
    formData.append(key, {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as never);
  }
};

const generateUploadingFile = (
  fileName?: string | null,
  id?: string | null,
) => {
  return String(fileName || `${id}_${Math.random().toString(36)}`);
};
