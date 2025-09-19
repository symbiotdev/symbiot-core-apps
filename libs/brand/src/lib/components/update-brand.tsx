import { AvatarPicker, FormView, PageView } from '@symbiot-core-apps/ui';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { BrandNameController } from './contollers/brand-name-controller';
import { BrandWebsitesController } from './contollers/brand-websites-controller';
import { BrandInstagramsController } from './contollers/brand-instagrams-controller';
import { BrandBirthdayController } from './contollers/brand-birthday-controller';
import { BrandAboutController } from './contollers/brand-about-controller';
import {
  UpdateBrand as TUpdateBrand,
  useCurrentBrandUpdate,
} from '@symbiot-core-apps/api';
import { useCallback } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';
import { BrandCountriesController } from './contollers/brand-countries-controller';

export const UpdateBrand = () => {
  const { brand, setBrand } = useCurrentBrandState();
  const { mutateAsync: updateBrand } = useCurrentBrandUpdate();
  const { mutateAsync: updateAvatar, isPending: isAvatarUpdating } =
    useCurrentBrandUpdate();

  const updateBrand$ = useCallback(
    async (data: TUpdateBrand) => setBrand(await updateBrand(data)),
    [setBrand, updateBrand],
  );

  const updateAvatar$ = useCallback(
    async (avatar: ImagePickerAsset) =>
      setBrand(await updateAvatar({ avatar })),
    [updateAvatar, setBrand],
  );

  return (
    brand && (
      <PageView scrollable withHeaderHeight withKeyboard gap="$5">
        <AvatarPicker
          alignSelf="center"
          loading={isAvatarUpdating}
          name={brand.name}
          color={brand.avatarColor}
          url={brand.avatarUrl}
          size={100}
          onAttach={updateAvatar$}
        />

        <FormView>
          <BrandNameController name={brand.name} onUpdate={updateBrand$} />
          <BrandCountriesController
            countries={brand.countries}
            onUpdate={updateBrand$}
          />
          <BrandWebsitesController
            websites={brand.websites}
            onUpdate={updateBrand$}
          />
          <BrandInstagramsController
            instagrams={brand.instagrams}
            onUpdate={updateBrand$}
          />
          <BrandBirthdayController
            birthday={brand.birthday}
            onUpdate={updateBrand$}
          />
          <BrandAboutController about={brand.about} onUpdate={updateBrand$} />
        </FormView>
      </PageView>
    )
  );
};
