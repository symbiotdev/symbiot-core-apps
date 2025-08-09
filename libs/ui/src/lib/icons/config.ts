import { SvgProps } from 'react-native-svg';
import { ReactElement } from 'react';

export type IconName =
  | 'AddCircle'
  | 'AddSquare'
  | 'AltArrowDown'
  | 'AltArrowUp'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Bell'
  | 'Calendar'
  | 'CalendarMinimalistic'
  | 'Camera'
  | 'CloseCircle'
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
  | 'MagicStick'
  | 'MenuDotsCircle'
  | 'Moon'
  | 'PaperclipRounded'
  | 'Pen'
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
  | 'Widget'
  | 'Widget3';
export type IconMap = Record<IconName, (props: IconProps) => ReactElement>;

export type IconProps = SvgProps & {
  secondColor?: string;
};
