import { ImagePickerAsset } from 'expo-image-picker';
import { Platform } from 'react-native';

export type UploadingFile = {
  uri: string;
  name: string;
  type: string;
};

export const convertImagePickerAssetToUploadingFile = (
  asset: ImagePickerAsset,
) => ({
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
    (Object.keys(data) as (keyof D)[]).map(async (key) => {
      const value = data[key] as unknown;

      if (!value) return;

      if (fileKeys.includes(key)) {
        const file = convertImagePickerAssetToUploadingFile(
          value as ImagePickerAsset,
        );

        if (Platform.OS === 'web') {
          const blob = await fetch(file.uri);

          formData.append(key as string, await blob.blob());
        } else {
          formData.append(
            key as string,
            {
              uri: file.uri,
              name: file.name,
              type: file.type,
            } as never,
          );
        }
      } else {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(
              `${key as string}[]`,
              typeof item === 'object' ? JSON.stringify(item) : item,
            );
          });
        } else {
          formData.append(key as string, value as string);
        }
      }
    }),
  );

  return formData;
}

const generateUploadingFile = (
  fileName?: string | null,
  id?: string | null,
) => {
  return String(fileName || `${id}_${Math.random().toString(36)}`);
};
