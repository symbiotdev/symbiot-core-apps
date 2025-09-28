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
}) =>
  mask(props.price - (props.discount || 0), undefined, 'currency', {
    ...priceMaskOptions,
    prefix: props.symbol,
  });

export const formatDiscount = (props: { discount: number; symbol?: string }) =>
  mask(props.discount, undefined, 'currency', {
    ...priceMaskOptions,
    prefix: props.symbol,
  });
