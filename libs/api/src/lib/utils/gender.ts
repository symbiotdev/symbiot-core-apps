import { Gender } from '../types/gender';

export const gendersWithoutEmptyOption = (genders?: Gender[]) =>
  genders?.filter(({ value }) => !!value);
