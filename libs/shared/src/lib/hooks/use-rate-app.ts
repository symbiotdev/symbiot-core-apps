import { useCallback, useMemo } from 'react';
import { isAvailableAsync, requestReview } from 'expo-store-review';
import { Linking, Platform } from 'react-native';
import { ANDROID_STORE_URL, IOS_STORE_URL } from './use-share-app';
import { useI18n } from '../i18n/i18n-provider';
import { ConfirmAlert } from '../utils/confirm';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '../storage/zustand';
import { DateHelper } from '../utils/date-helper';

type FeatureKey = 'common' | string;
type State = {
  lastRateDate: Record<FeatureKey, Date>;
  setLastRateDate: (feature: FeatureKey, date: Date) => void;
};

const useRateState = create<State>()(
  persist<State>(
    (set, get) => ({
      lastRateDate: {},
      setLastRateDate: (feature, date) =>
        set({
          lastRateDate: {
            ...get().lastRateDate,
            [feature]: date,
          },
        }),
    }),
    {
      name: 'app::rate',
      storage: createZustandStorage(),
    },
  ),
);

export const useRateApp = ({
  supportWeb = false,
  rateInterval = 30,
}: {
  supportWeb?: boolean;
  rateInterval?: number; // in days
} = {}) => {
  const { t } = useI18n();
  const { lastRateDate, setLastRateDate } = useRateState();

  const canRate = useMemo(
    () => Platform.OS !== 'web' || supportWeb,
    [supportWeb],
  );

  const leaveReview = useCallback(
    () =>
      Linking.openURL(
        Platform.OS !== 'android'
          ? `${ANDROID_STORE_URL}&showAllReviews=true`
          : `${IOS_STORE_URL}?action=write-review`,
      ),
    [],
  );

  const rate = useCallback(
    async (featureKey: FeatureKey = 'common') => {
      const now = new Date();
      const lastRatedDate = lastRateDate[featureKey];

      if (
        lastRatedDate &&
        DateHelper.isBefore(
          now,
          DateHelper.addDays(
            DateHelper.startOfDay(lastRatedDate),
            rateInterval,
          ),
        )
      )
        return;

      try {
        const isAvailable = await isAvailableAsync();

        if (isAvailable) {
          await requestReview();
        } else {

          if (!canRate) return;

            ConfirmAlert({
              title: t('shared.rate_app.suggestion.title'),
              message: t('shared.rate_app.suggestion.subtitle'),
              onAgree: () => leaveReview(),
            });
        }

        setLastRateDate(featureKey, now);
      } catch (error) {
        console.log('Error useRateApp', error);
      }
    },
    [canRate, lastRateDate, rateInterval, setLastRateDate, t, leaveReview],
  );

  return {
    canRate,
    rate,
    leaveReview,
  };
};
