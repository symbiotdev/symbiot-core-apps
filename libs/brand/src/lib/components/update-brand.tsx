import { AvatarPicker, FormView, PageView } from '@symbiot-core-apps/ui';
import { useCurrentBrandState } from '@symbiot-core-apps/state';
import { BrandNameController } from './contollers/brand-name-controller';
import { BrandWebsiteController } from './contollers/brand-website-controller';
import { BrandInstagramController } from './contollers/brand-instagram-controller';
import { BrandBirthdayController } from './contollers/brand-birthday-controller';
import { BrandAboutController } from './contollers/brand-avout-controller';
import {
  UpdateBrand as TUpdateBrand,
  useCurrentBrandUpdate,
} from '@symbiot-core-apps/api';
import { useCallback } from 'react';
import { ImagePickerAsset } from 'expo-image-picker';

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
          <BrandWebsiteController
            websites={brand.websites}
            onUpdate={updateBrand$}
          />
          <BrandInstagramController
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
