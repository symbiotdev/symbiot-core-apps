import { Scheme } from '@symbiot-core-apps/shared';

export type AppLimits = {
  employees?: number;
  locations?: number;
  clients?: number;
  services?: number;
  periodMemberships?: number;
  visitMemberships?: number;
};

export type ThemeConfig = {
  background: string;
  background1: string;
  background2: string;
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
  switchSelectedColor: string;
  calendarBackgroundColor: string;
  calendarLineColor: string;
  calendarTimeColor: string;
  calendarTodayColor: string;
  calendarNowIndicatorColor: string;
  calendarUnavailableSlotBackgroundColor: string;
  calendarUnavailableSlotColor: string;
  calendarUnavailableSlotMarkerColor: string;
  calendarServiceSlotBackgroundColor: string;
  calendarServiceSlotColor: string;
  calendarServiceSlotMarkerColor: string;
  subscriptionBorderColor: string;
  subscriptionBackgroundColor: string;
  selectedSubscriptionBorderColor: string;
  selectedSubscriptionBackgroundColor: string;
};

export type AppConfigIconName =
  | 'Home'
  | 'Notifications'
  | 'Calendar'
  | 'TabsPlus'
  | 'Workspace'
  | 'Service'
  | 'Package'
  | 'PeriodBasedMembership'
  | 'VisitBasedMembership'
  | 'UnavailableBooking'
  | 'ServiceBooking'
  | 'More';

export type AppConfigFunctionality = {
  limits: Record<string, AppLimits>;
  availability: {
    servicePrice: boolean;
    brandIndustry: boolean;
    brandCompetitor: boolean;
  };
};

export type AppConfig = {
  icons: Record<AppConfigIconName, string>;
  theme: Record<Scheme, ThemeConfig>;
  functionality: AppConfigFunctionality;
};
