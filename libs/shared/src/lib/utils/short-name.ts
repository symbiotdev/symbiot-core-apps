export const shortName = (
  name: string,
  format: '2-first-letters' | 'trim-lastname',
) => {
  if (!name) {
    return 'A'
  }

  if (format === '2-first-letters') {
    const [f, l] = name
      .split(' ')
      .map((txt) => txt.charAt(0))
      .filter(Boolean);

    return `${f}${l || ''}`.toUpperCase();
  }

  if (format === 'trim-lastname') {
    const [firstname, lastname] = name.split(' ');

    return `${firstname}${lastname ? ` ${lastname?.charAt?.(0) || ''}.` : ''}`;
  }

  return name;
};
