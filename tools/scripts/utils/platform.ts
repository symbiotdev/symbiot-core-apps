import { select } from '@inquirer/prompts';

export enum Platform {
  web = 'web',
  ios = 'ios',
  android = 'android',
}

export const selectPlatform = ({
  nativeOnly,
}: { nativeOnly?: boolean } = {}): Promise<Platform> =>
  Platform[process.env['NODE_PLATFORM']] ||
  select({
    message: 'Platform',
    choices: [
      ...(!nativeOnly
        ? [
            {
              name: 'Web',
              value: Platform.web,
            },
          ]
        : []),
      {
        name: 'IOS',
        value: Platform.ios,
      },
      {
        name: 'Android',
        value: Platform.android,
      },
    ],
  });
