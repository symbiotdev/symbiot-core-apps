import { Scheme } from '@symbiot-core-apps/shared';

export type ThemeConfig = {
  background: string;
  background1: string;
  color: string;
  colorPress: string;
  error: string;
  link: string;
  disabled: string;
  highlighted: string;
  borderColor: string;
  borderColorHover: string;
  borderColorFocus: string;
  outlineColor: string;
  buttonBackground: string;
  buttonTextColor: string;
  buttonTextColor1: string;
  checkboxColor: string;
  inputBackgroundColor: string;
  placeholderColor: string;
  tabBarActiveTintColor: string;
  tabBarInactiveTintColor: string;
  qrCode: string;
  qrCodeGradientFrom: string;
  qrCodeGradientTo: string;
  calendarBackgroundColor: string;
  calendarLineColor: string;
  calendarTimeColor: string;
  calendarTodayColor: string;
  calendarNowIndicatorColor: string;
  switchSelectedColor: string;
};

export type AppConfigIconName =
  | 'Home'
  | 'Notifications'
  | 'Calendar'
  | 'TabsPlus'
  | 'Workspace'
  | 'Service'
  | 'Package'
  | 'Membership'
  | 'More';

export type AppConfigFunctionality = {
  availability: {
    brandIndustry: boolean;
  };
};

export type AppConfig = {
  icons: Record<AppConfigIconName, string>;
  theme: Record<Scheme, ThemeConfig>;
  functionality: AppConfigFunctionality;
};
