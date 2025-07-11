import { Platform } from 'react-native';
import * as Application from 'expo-application';
import {
  brand,
  deviceName,
  deviceType,
  manufacturer,
  modelName,
  osName,
  osVersion,
} from 'expo-device';

export const DeviceInfo = {
  os: Platform.OS,
  osName,
  osVersion,
  brand,
  deviceName,
  deviceType,
  manufacturer,
  modelName,
};

export const DeviceVersion = Application.nativeApplicationVersion || 'latest';
