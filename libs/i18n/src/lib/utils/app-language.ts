export enum AppLanguage {
  en = 'en',
  uk = 'uk',
}

export const supportedLanguages: AppLanguage[] = Object.values(AppLanguage);

export interface LanguageOption {
  code: AppLanguage;
  name: string;
  shortName: string;
  flag: string;
  description: string;
  buttons: {
    select: {
      label: string;
    };
    selected: {
      label: string;
    };
  };
}

export const appLanguagesOptions: LanguageOption[] = [
  {
    code: AppLanguage.en,
    name: 'English',
    shortName: 'Eng',
    flag: '🇺🇸',
    description:
      'The interface will use English for all interactions. Additionally, you will receive push notifications and emails in this language.',
    buttons: {
      select: {
        label: 'Change',
      },
      selected: {
        label: 'Chosen',
      },
    },
  },
  {
    code: AppLanguage.uk,
    name: 'Українська',
    shortName: 'Укр',
    flag: '🇺🇦',
    description:
      'Інтерфейс використовуватиме українську мову для всіх взаємодій. Крім того, ви отримуватимете push-повідомлення та електронні листи цією мовою.',
    buttons: {
      select: {
        label: 'Вибрати',
      },
      selected: {
        label: 'Вибрано',
      },
    },
  },
];
