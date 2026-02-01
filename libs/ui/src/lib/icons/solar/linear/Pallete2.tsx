import Svg, { G, Path } from 'react-native-svg';
import { IconProps } from '../../icon-props';

export const Pallete2 = (props: IconProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <G transform="scale(1.15) translate(-2, 0)">
      <Path
        d="M12 2.5
         C13.2 2.5 13.8 4 15 4.3
         C16.2 4.6 17.6 3.6 18.5 4.5
         C19.4 5.4 18.4 6.8 18.7 8
         C19 9.2 21.5 9.8 21.5 11
         C21.5 12.2 19 12.8 18.7 14
         C18.4 15.2 19.4 16.6 18.5 17.5
         C17.6 18.4 16.2 17.4 15 17.7
         C13.8 18 13.2 19.5 12 19.5
         C10.8 19.5 10.2 18 9 17.7
         C7.8 17.4 6.4 18.4 5.5 17.5
         C4.6 16.6 5.6 15.2 5.3 14
         C5 12.8 2.5 12.2 2.5 11
         C2.5 9.8 5 9.2 5.3 8
         C5.6 6.8 4.6 5.4 5.5 4.5
         C6.4 3.6 7.8 4.6 9 4.3
         C10.2 4 10.8 2.5 12 2.5Z"
        stroke={props.color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {/* Half moon */}
      <Path
        d="M12 7
         C10 7 8.5 9.2 8.5 11
         C8.5 12.8 10 15 12 15"
        fill={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);
