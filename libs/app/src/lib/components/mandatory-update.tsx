import {
  Button,
  CompactView,
  H2,
  Icon,
  PageView,
  RegularText,
  SemiBoldText,
} from '@symbiot-core-apps/ui';
import {
  DeviceVersion,
  openPlatformStore,
  useI18n,
} from '@symbiot-core-apps/shared';
import { useAppState } from '../hooks/use-app-state';

export const MandatoryUpdate = () => {
  const { t } = useI18n();
  const { versionDetails } = useAppState();

  return (
    <PageView scrollable>
      <CompactView marginVertical="auto" alignItems="center">
        <Icon name="Bolt" size={50} />

        <H2 textAlign="center" marginTop="$2">
          {t('shared.app_mandatory_update.title')}
        </H2>

        <SemiBoldText textAlign="center">
          {t('shared.app_mandatory_update.subtitle')}
        </SemiBoldText>

        <RegularText textAlign="center" color="$placeholderColor">
          {t('shared.app_mandatory_update.installed_version', {
            version: DeviceVersion,
          })}
        </RegularText>

        <RegularText textAlign="center" color="$placeholderColor">
          {t('shared.app_mandatory_update.min_supported_version', {
            version: versionDetails?.minSupported,
          })}
        </RegularText>

        <Button
          width="auto"
          marginTop="$5"
          label={t('shared.app_mandatory_update.download')}
          onPress={openPlatformStore}
        />
      </CompactView>
    </PageView>
  );
};
