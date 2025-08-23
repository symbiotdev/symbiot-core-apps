type Translations = {
  [key: string]: string | Translations;
};

export type AppLanguage = {
  name: string;
  shortName: string;
  flag: string;
  code: string;
};

export type AppTranslations = {
  translations: Translations;
  languages: AppLanguage[];
};
