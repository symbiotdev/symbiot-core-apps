export const isValidURL = (str: string) => {
  try {
    const url = new URL(str);

    return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(url.hostname);
  } catch {
    return false;
  }
};
