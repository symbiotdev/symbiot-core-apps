import { BrandClient } from '@symbiot-core-apps/api';
import { FormView, ListItemGroup, PageView } from '@symbiot-core-apps/ui';
import { BrandClientMediaForm } from './brand-client-media-form';
import { BrandClientPersonalInfo } from './brand-client-personal-info';
import { BrandClientContactInfo } from './brand-client-contact-info';
import { BrandClientNoteForm } from './brand-client-note-form';

export const BrandClientForm = ({ client }: { client: BrandClient }) => {
  return (
    <PageView scrollable withHeaderHeight withKeyboard>
      <FormView gap="$10" paddingVertical="$5">
        <BrandClientMediaForm client={client} />

        <ListItemGroup>
          <BrandClientPersonalInfo client={client} />
          <BrandClientContactInfo client={client} />
          <BrandClientNoteForm client={client} />
        </ListItemGroup>
      </FormView>
    </PageView>
  );
};
