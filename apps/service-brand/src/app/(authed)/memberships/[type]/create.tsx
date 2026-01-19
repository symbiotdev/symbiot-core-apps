import { CreateBrandMembership } from '@symbiot-core-apps/brand-membership';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import {
  BrandMembershipType,
  getTranslateKeyByBrandMembershipType,
} from '@symbiot-core-apps/api';
import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { type } = useLocalSearchParams<{ type: BrandMembershipType }>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t(`${getTranslateKeyByBrandMembershipType(type)}.create.new`),
    });
  }, [navigation, type, t]);

  return <CreateBrandMembership type={type} />;
};
