// fixme replace with context hook
export const useTheme = () => {
  const colors: Record<string, string> = {
    $primary: '#FFFFFF',
    $secondary: 'red',
  };

  const dimensions: Record<string, number> = {
    $1: 5,
    $2: 10,
  };

  return {
    colors,
    dimensions,
  };
};
