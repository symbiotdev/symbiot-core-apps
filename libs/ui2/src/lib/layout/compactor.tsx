import { Container, ContainerProps } from './container';

export const Compactor = ({
  style,
  lazy = false,
  ...props
}: ContainerProps) => (
  <Container {...props} lazy={lazy} style={[{ maxWidth: 600 }, style]} />
);
