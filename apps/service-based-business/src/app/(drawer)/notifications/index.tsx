import { Notifications } from '@symbiot-core-apps/notification';
import { onPressNotification } from '../../../utils/notification';

export default () => (
  <Notifications onPressNotification={onPressNotification} />
);
