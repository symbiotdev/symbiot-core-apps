import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const AltArrowRight = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color}
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
      strokeWidth={1.5}
      d="m9 5 6 7-6 7"
    />
  </Svg>
);
