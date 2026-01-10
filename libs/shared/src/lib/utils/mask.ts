import { mask, MaskedTextInputProps } from 'react-native-mask-text';

export const priceMaskOptions: MaskedTextInputProps['options'] = {
  decimalSeparator: '.',
  groupSeparator: ',',
  precision: 2,
};

export const formatPrice = (props: {
  price: number;
  discount?: number;
  symbol?: string;
}) => {
  const isNegative = props.price < 0;
  const divider = isNegative ? -1 : 1;
  const value = (Math.abs(props.price) - (props.discount || 0)) * divider;

  return `${isNegative ? '-' : ''}${mask(
    Math.abs(value),
    undefined,
    'currency',
    {
      ...priceMaskOptions,
      prefix: props.symbol,
    },
  )}`;
};

export const formatDiscount = (props: {
  discount: number;
  symbol?: string;
}) => {
  return `${props.discount < 0 ? '-' : ''}${mask(
    Math.abs(props.discount),
    undefined,
    'currency',
    {
      ...priceMaskOptions,
      prefix: props.symbol,
    },
  )}`;
};
