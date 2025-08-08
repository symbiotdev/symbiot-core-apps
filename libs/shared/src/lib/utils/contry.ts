export const getCountryEmoji = (code: string) => {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map(
      (char) => 0x1f1e6 + char.charCodeAt(0) - 'A'.charCodeAt(0),
    ),
  );
};
