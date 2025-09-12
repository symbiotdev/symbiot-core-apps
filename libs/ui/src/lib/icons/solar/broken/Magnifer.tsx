import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const Magnifer = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M18.5 18.5L22 22"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M6.75 3.27093C8.14732 2.46262 9.76964 2 11.5 2C16.7467 2 21 6.25329 21 11.5C21 16.7467 16.7467 21 11.5 21C6.25329 21 2 16.7467 2 11.5C2 9.76964 2.46262 8.14732 3.27093 6.75"
      stroke={props.color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
