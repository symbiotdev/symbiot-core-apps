import { mask } from 'react-native-mask-text';
import { priceMaskOptions } from '@symbiot-core-apps/ui';
import { Currency } from '@symbiot-core-apps/api';

export const formatBrandServicePrice = (props: {
  price: number;
  discount?: number;
  currency?: Currency;
}) =>
  mask(props.price - (props.discount || 0), undefined, 'currency', {
    ...priceMaskOptions,
    prefix: props.currency?.symbol,
  });

export const formatBrandServiceDiscount = (props: {
  discount: number;
  currency?: Currency;
}) =>
  mask(props.discount, undefined, 'currency', {
    ...priceMaskOptions,
    prefix: props.currency?.symbol,
  });
