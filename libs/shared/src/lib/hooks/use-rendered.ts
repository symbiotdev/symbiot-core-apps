import { useEffect, useState } from 'react';

export const useRendered = (props?: {
  delay?: number;
  defaultTrue?: boolean;
}) => {
  const [rendered, setRendered] = useState(!!props?.defaultTrue);

  useEffect(() => {
    setTimeout(() => setRendered(true), props?.delay);
  }, []);

  return {
    rendered,
  };
};
