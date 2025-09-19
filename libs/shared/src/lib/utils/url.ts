export const linkPattern = /^[a-z0-9.-]+\.[a-z]{2,}$/i;

export const isValidURL = (str: string) => {
  try {
    const url = new URL(str);

    return linkPattern.test(url.hostname);
  } catch {
    return false;
  }
};
