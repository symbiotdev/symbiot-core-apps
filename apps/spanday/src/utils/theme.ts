import { ThemeConfig } from '@symbiot-core-apps/theme';

const primary100 = '#7B5AED';
const primary60 = '#7B5AED60';
const primary20 = '#7B5AED20';

export const lightTheme: ThemeConfig = {
  background: '#F2F2F2',
  background1: '#FFFFFF',
  color: '#000000',
  colorPress: '#000000',
  error: '#C62828',
  link: '#777777',
  placeholderColor: '#999999',
  disabled: '#999999',
  highlighted: primary20,
  borderColor: '#111111',
  borderColorHover: 'transparent',
  borderColorFocus: 'transparent',
  outlineColor: 'transparent',
  buttonBackground: primary100,
  buttonTextColor: '#FFFFFF',
  buttonTextColor1: primary100,
  checkboxColor: primary100,
  inputBackgroundColor: '#FFFFFF',
  tabBarActiveTintColor: primary100,
  tabBarInactiveTintColor: '#111111',
  qrCode: '#191919',
  qrCodeGradientFrom: primary100,
  qrCodeGradientTo: primary60,
};

export const darkTheme: ThemeConfig = {
  background: '#000000',
  background1: '#191919',
  color: '#FFFFFF',
  colorPress: '#FFFFFF',
  error: '#FF6B6B',
  link: '#777777',
  placeholderColor: '#999999',
  disabled: '#999999',
  highlighted: primary60,
  borderColor: '#F5F5F5',
  borderColorHover: 'transparent',
  borderColorFocus: 'transparent',
  outlineColor: 'transparent',
  buttonBackground: primary100,
  buttonTextColor: '#FFFFFF',
  buttonTextColor1: primary100,
  checkboxColor: primary100,
  inputBackgroundColor: '#1A1A1A',
  tabBarActiveTintColor: primary100,
  tabBarInactiveTintColor: '#dddddd',
  qrCode: '#F5F5F5',
  qrCodeGradientFrom: primary100,
  qrCodeGradientTo: primary20,
};
