import { BrandEmployee } from '@symbiot-core-apps/api';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import {
  useAnniversaryState,
  useBirthdayState,
} from '@symbiot-core-apps/state';
import { ClosableCard, formViewStyles } from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import {
  DateHelper,
  secondsInHour,
  useNativeNow,
} from '@symbiot-core-apps/shared';
import { View } from 'tamagui';

export const BrandEmployeeCongrats = ({
  employee,
}: {
  employee: BrandEmployee;
}) => {
  const { t } = useTranslation();
  const { byEmployeeId: anniversaryById, hide: hideAnniversary } =
    useAnniversaryState();
  const { byEmployeeId: birthdayById, hide: hideBirthday } = useBirthdayState();
  const { now } = useNativeNow(secondsInHour);

  const isBirthdayToday = useMemo(
    () =>
      employee.birthday &&
      DateHelper.isSameDateIgnoringYear(employee.birthday, now) &&
      !DateHelper.isSameDay(birthdayById[employee.id], now),
    [birthdayById, employee.birthday, employee.id, now],
  );

  const isAnniversaryToday = useMemo(
    () =>
      employee.cAt &&
      DateHelper.isSameDateIgnoringYear(employee.cAt, now) &&
      !DateHelper.isSameDay(employee.cAt, now) &&
      !DateHelper.isSameDay(anniversaryById[employee.id], now),
    [anniversaryById, employee.cAt, employee.id, now],
  );

  return (
    (isAnniversaryToday || isBirthdayToday) && (
      <View gap="$1" style={formViewStyles}>
        {isBirthdayToday && (
          <Animated.View
            style={formViewStyles}
            entering={FadeInUp}
            exiting={FadeOutUp}
          >
            <ClosableCard
              iconName="Confetti"
              title={t(`brand_employee.congrats.birthday.title`)}
              subtitle={t(`brand_employee.congrats.birthday.message`)}
              onClose={() => hideBirthday('byEmployeeId', employee.id)}
            />
          </Animated.View>
        )}

        {isAnniversaryToday && (
          <Animated.View
            style={formViewStyles}
            entering={FadeInUp}
            exiting={FadeOutUp}
          >
            <ClosableCard
              iconName="MagicStick"
              title={t(`brand_employee.congrats.anniversary.title`)}
              subtitle={t(`brand_employee.congrats.anniversary.message`)}
              onClose={() => hideAnniversary('byEmployeeId', employee.id)}
            />
          </Animated.View>
        )}
      </View>
    )
  );
};
