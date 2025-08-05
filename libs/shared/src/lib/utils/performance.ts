export const isDeviceSlowAsync = () =>
  new Promise<boolean>((resolve) => resolve(isDeviceSlow()));

export const isDeviceSlow = () => {
  const start = performance.now();
  const largeArray = Array.from({ length: 1e2 }, (_, i) => i);

  largeArray.sort(() => Math.random() - 0.5);

  const end = performance.now();

  return +(end - start).toFixed(2) > 0.1;
};
