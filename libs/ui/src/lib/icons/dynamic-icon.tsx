import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from '@expo/vector-icons';
import { ViewStyle } from 'react-native';
import { useTheme } from 'tamagui';
import { loadAsync } from 'expo-font';

export type DynamicIconType =
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Feather'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'FontAwesome6'
  | 'Fontisto'
  | 'Foundation'
  | 'Ionicons'
  | 'MaterialCommunityIcons'
  | 'MaterialIcons'
  | 'Octicons'
  | 'SimpleLineIcons'
  | 'Zocial';

export type DynamicIconProps = {
  type: DynamicIconType;
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
};

const iconSet = {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
};

void loadAsync(
  Object.values(iconSet).reduce(
    (obj, { font }) => ({
      ...obj,
      ...font,
    }),
    {},
  ),
);

export const DynamicIcon = (props: DynamicIconProps) => {
  const { type, name, size, color, style } = props;
  const IconComponent = iconSet[type];
  const theme = useTheme();

  if (!IconComponent) {
    return null;
  }

  return (
    <IconComponent
      name={name}
      size={size || 20}
      color={color ? theme[color]?.val || color : theme.color?.val}
      style={style}
    />
  );
};
