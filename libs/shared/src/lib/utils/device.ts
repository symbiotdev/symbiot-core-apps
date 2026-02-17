import { Platform } from 'react-native';
import * as Application from 'expo-application';
import {
  brand,
  deviceName,
  DeviceType,
  deviceType,
  manufacturer,
  modelName,
  osName,
  osVersion,
} from 'expo-device';

export const DeiceOS = Platform.OS;

export const DeviceInfo = {
  os: DeiceOS,
  osName,
  osVersion,
  brand,
  deviceName,
  deviceType,
  manufacturer,
  modelName,
};

export const DeviceVersion = Application.nativeApplicationVersion || 'latest';

export const isPhone = deviceType === DeviceType.PHONE;
export const isTablet = deviceType === DeviceType.TABLET;
export const isWeb = DeiceOS === 'web';
export const isIos = DeiceOS === 'ios';
export const isAndroid = DeiceOS === 'android';

export const iosCornerRadiusGroups: Record<string, string[]> = {
  '39.0': [
    'iPhone X',
    'iPhone XS',
    'iPhone XS Max',
    'iPhone 11 Pro',
    'iPhone 11 Pro Max',
  ],
  '41.5': ['iPhone XR', 'iPhone 11'],
  '44.0': ['iPhone 12 mini', 'iPhone 13 mini'],
  '47.33': [
    'iPhone 12',
    'iPhone 12 Pro',
    'iPhone 13 Pro',
    'iPhone 14',
    'iPhone 16e',
    'iPhone 16',
    'iPhone 16 Plus',
    'iPhone 16 Pro',
    'iPhone 16 Pro Max',
  ],
  '53.33': ['iPhone 12 Pro Max', 'iPhone 13 Pro Max', 'iPhone 14 Plus'],
  '55.0': [
    'iPhone 14 Pro',
    'iPhone 14 Pro Max',
    'iPhone 15',
    'iPhone 15 Plus',
    'iPhone 15 Pro',
    'iPhone 15 Pro Max',
  ],
  '62.0': ['iPhone 17', 'iPhone 17 Pro', 'iPhone 17 Pro Max', 'iPhone Air'],
  '18.0': ['iPad Air', 'iPad Pro 11-inch', 'iPad Pro 12.9-inch'],
};
