import { BrandClient } from '@symbiot-core-apps/api';
import { Avatar, PageView } from '@symbiot-core-apps/ui';

export const BrandClientProfile = ({ client }: { client: BrandClient }) => {
  return (
    <PageView scrollable withHeaderHeight>
      <Avatar
        color="$background1"
        name={`${client.firstname} ${client.lastname}`}
        url={client.avatarXsUrl}
        size={50}
      />
    </PageView>
  );
};
