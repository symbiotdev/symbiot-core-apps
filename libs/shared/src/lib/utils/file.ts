import { Asset } from 'expo-asset';
import { shareAsync } from 'expo-sharing';
import { ShowNativeFailedAlert } from './burnt';
import { isWeb } from './device';
import { File as ExpoFile, Paths } from 'expo-file-system';

export async function downloadArrayBuffer(
  arrayBuffer: ArrayBufferLike,
  fileName: string,
) {
  if (isWeb) {
    const blob = new Blob([arrayBuffer as BlobPart]);
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } else {
    try {
      const bytes = new Uint8Array(arrayBuffer);
      const len = bytes.byteLength;
      let binary = '';

      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }

      const uri = `${Paths.cache.uri}${fileName}`;
      const base64 = btoa(binary);

      new ExpoFile(uri).write(base64, {
        encoding: 'base64',
      });

      const asset = Asset.fromModule(uri);
      await asset.downloadAsync();

      if (asset.localUri) {
        await shareAsync(asset.localUri);
      } else {
        ShowNativeFailedAlert({
          // fixme localize
          text: 'Download failed',
        });
      }
    } catch (error) {
      ShowNativeFailedAlert({
        // fixme localize
        text: JSON.stringify(error),
      });

      throw error;
    }
  }
}

export function readFileWeb(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
