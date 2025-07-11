import { ImagePickerAsset } from 'expo-image-picker';
import { Platform } from 'react-native';

export type UploadingFile = {
  uri: string;
  name: string;
  type: string;
};

export const convertImagePickerAssetsToUploadingFiles = (
  assets: ImagePickerAsset[]
): UploadingFile[] => {
  return assets.map((asset) => ({
    uri: asset.uri,
    name: generateUploadingFile(asset.fileName, asset.assetId),
    type: asset.mimeType || 'unknown',
  }));
};

export const generateFormDataFromUploadingFile = async (
  file: UploadingFile,
  fileKey: string
) => {
  const formData = new FormData();

  if (Platform.OS === 'web') {
    const blob = await fetch(file.uri);
    formData.append(fileKey, await blob.blob());
  } else {
    formData.append(fileKey, {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as never);
  }

  return formData;
};

const generateUploadingFile = (
  fileName?: string | null,
  id?: string | null
) => {
  return String(fileName || `${id}_${Math.random().toString(36)}`);
};
