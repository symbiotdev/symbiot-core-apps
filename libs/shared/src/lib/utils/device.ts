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
