type Language = string;

export type AppSettings = {
  language: {
    default: Language;
    translations: Record<Language, Record<string, unknown>>;
  };
};
