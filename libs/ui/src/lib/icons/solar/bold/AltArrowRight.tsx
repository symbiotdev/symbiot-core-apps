import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const AltArrowRight = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M15.8351 11.6296L9.20467 5.1999C8.79094 4.79869 8 5.04189 8 5.5703L8 18.4297C8 18.9581 8.79094 19.2013 9.20467 18.8001L15.8351 12.3704C16.055 12.1573 16.0549 11.8427 15.8351 11.6296Z"
      stroke={props.color}
    />
  </Svg>
);
