import { BrandService } from '@symbiot-core-apps/api';
import { mask } from 'react-native-mask-text';
import { priceMaskOptions } from '@symbiot-core-apps/ui';

export const formatBrandServicePrice = (
  service: BrandService,
  ignoreDiscount = false,
) =>
  mask(
    service.price - (!ignoreDiscount ? service.discount : 0),
    undefined,
    'currency',
    priceMaskOptions,
  );
