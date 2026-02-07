import { useCallback, useMemo } from 'react';
import { isAvailableAsync, requestReview } from 'expo-store-review';
import { Linking, Platform } from 'react-native';
import { STORE_URL } from './use-share-app';
import { useI18n } from '../i18n/i18n-provider';
import { ConfirmAlert } from '../utils/confirm';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createZustandStorage } from '../storage/zustand';
import { DateHelper } from '../utils/date-helper';

type FeatureKey = 'common' | string;
type State = {
  lastRateDate: Record<FeatureKey, Date>;
  countRates: Record<FeatureKey, number>;
  setLastRateDate: (feature: FeatureKey, date: Date) => void;
};

const useRateState = create<State>()(
  persist<State>(
    (set, get) => ({
      lastRateDate: {},
      countRates: {},
      setLastRateDate: (feature, date) => {
        const { countRates, lastRateDate } = get();

        set({
          lastRateDate: { ...lastRateDate, [feature]: date },
          countRates: {
            ...countRates,
            [feature]: (countRates[feature] || 0) + 1,
          },
        });
      },
    }),
    {
      name: 'app::rate',
      storage: createZustandStorage(),
    },
  ),
);

export const leaveReview = () =>
  Linking.openURL(
    `${STORE_URL}${Platform.OS === 'android' ? '&showAllReviews=true' : '?action=write-review'}`,
  );

export const useRateApp = ({
  supportWeb = false,
  rateInterval = 30,
  maxRates = 3,
}: {
  supportWeb?: boolean;
  rateInterval?: number; // in days
  maxRates?: number;
} = {}) => {
  const { t } = useI18n();
  const { lastRateDate, countRates, setLastRateDate } = useRateState();

  const canRate = useMemo(
    () => Platform.OS !== 'web' || supportWeb,
    [supportWeb],
  );

  const rate = useCallback(
    async (featureKey: FeatureKey = 'common') => {
      const countFeatureRates = countRates[featureKey];

      if (countFeatureRates && countFeatureRates >= maxRates) return;

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
    [
      countRates,
      maxRates,
      lastRateDate,
      rateInterval,
      setLastRateDate,
      canRate,
      t,
    ],
  );

  return {
    canRate,
    rate,
    leaveReview,
  };
};
