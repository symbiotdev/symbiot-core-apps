import { router } from 'expo-router';

export const goBack = () =>
  router.canGoBack() ? router.back() : router.navigate('/');
