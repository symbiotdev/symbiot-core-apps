import { Scheme } from '@symbiot-core-apps/shared';

export type AppSettings = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icons: Record<AppConfigIconName, any>;
  theme: Record<Scheme, ThemeConfig>;
  language: {
    default: string;
    translations: Record<string, Record<string, unknown>>;
  };
  functionality: {
    limits: Record<string, AppLimit>;
    availability: {
      brandIndustry: boolean;
      brandCompetitor: boolean;
      servicePrice: boolean;
    };
  };
};

type AppLimit = {
  employees?: number;
  locations?: number;
  clients?: number;
  services?: number;
  periodMemberships?: number;
  visitMemberships?: number;
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

export type ThemeConfig = {
  background: string;
  background1: string;
  background2: string;
  overlay: string;
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
  calendarHeaderBackgroundColor: string;
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
