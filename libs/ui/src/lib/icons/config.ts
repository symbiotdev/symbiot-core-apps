import { SvgProps } from 'react-native-svg';
import { ReactElement } from 'react';

export type IconName =
  | 'AddSquare'
  | 'AltArrowDown'
  | 'AltArrowUp'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Bell'
  | 'Calendar'
  | 'CalendarMinimalistic'
  | 'Camera'
  | 'CodeCircle'
  | 'CrownLine'
  | 'FileText'
  | 'Gallery'
  | 'Global'
  | 'Heart'
  | 'Home'
  | 'HomeAdd'
  | 'Letter'
  | 'Logout2'
  | 'MenuDotsCircle'
  | 'Moon'
  | 'QrCode'
  | 'QuestionCircle'
  | 'Share'
  | 'ShareCircle'
  | 'Suitcase'
  | 'Sun'
  | 'TrashBinMinimalistic'
  | 'TuningSquare'
  | 'Unread'
  | 'UserCircle'
  | 'Widget';
export type IconMap = Record<IconName, (props: IconProps) => ReactElement>;

export type IconProps = SvgProps & {
  secondColor?: string;
};
