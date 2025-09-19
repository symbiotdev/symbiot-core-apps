import { AvatarPicker, FormView, PageView } from '@symbiot-core-apps/ui';
import { useCurrentBrandUpdater } from '@symbiot-core-apps/state';
import { BrandNameController } from './contollers/brand-name-controller';
import { BrandWebsiteController } from './contollers/brand-website-controller';
import { BrandInstagramController } from './contollers/brand-instagram-controller';
import { BrandBirthdayController } from './contollers/brand-birthday-controller';
import { BrandAboutController } from './contollers/brand-avout-controller';

export const BrandUpdate = () => {
  const { brand, updateBrand$, updateAvatar$, avatarUpdating } =
    useCurrentBrandUpdater();

  return (
    brand && (
      <PageView scrollable withHeaderHeight withKeyboard gap="$5">
        <AvatarPicker
          alignSelf="center"
          loading={avatarUpdating}
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
