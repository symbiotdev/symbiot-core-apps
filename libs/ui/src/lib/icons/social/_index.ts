import { Apple } from './Apple';
import { Google } from './Google';
import { X } from './X';
import { Instagram } from './Instagram';
import { LinkedIn } from './LinkedIn';

export const Map = {
  Apple,
  Google,
  Instagram,
  LinkedIn,
  X,
};

export type SocialIconName = keyof typeof Map;
