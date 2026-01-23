import { select } from '@inquirer/prompts';

export enum App {
  DanceHub = 'symbiothub-dance',
  Spanday = 'spanday',
}

const repoPath = process.cwd();

export const appConfig: Record<
  App,
  { name: string; src: string; dest: string }
> = {
  [App.DanceHub]: {
    name: 'service-brand',
    src: `${repoPath}/app-build-config/service-brand/symbiothub-dance`,
    dest: `${repoPath}/apps/service-brand`,
  },
  [App.Spanday]: {
    name: 'service-brand',
    src: `${repoPath}/app-build-config/service-brand/spanday`,
    dest: `${repoPath}/apps/service-brand`,
  },
};

export const getAppSyncPaths = ({ app, env }: { app: App; env: string }) => {
  const { src, dest } = appConfig[app];

  if ([App.DanceHub, App.Spanday].includes(app)) {
    return [
      {
        src: `${src}/assets`,
        dest: `${dest}/assets`,
      },
      {
        src: `${src}/i18n`,
        dest: `${dest}/i18n`,
      },
      {
        src: `${src}/google/${env.split('_')[0]}`,
        dest: `${dest}/google`,
      },
      {
        src: `${src}/.env.${env}`,
        dest: `${dest}/.env`,
      },
    ];
  } else {
    return [];
  }
};

export const selectApp = async (): Promise<App> =>
  App[process.env['NODE_APP']] ||
  (await select({
    message: 'Application',
    choices: [
      {
        name: 'DanceHub',
        value: App.DanceHub,
      },
      {
        name: 'Spanday',
        value: App.Spanday,
      },
    ],
  }));
