import { select } from '@inquirer/prompts';

export enum App {
  DanceHub = 'symbiothub-dance',
  Spanday = 'spanday',
}

const repoPath = process.cwd();

export const appBuildConfigPath: Record<App, string> = {
  [App.DanceHub]: `${repoPath}/app-build-config/service-brand/${App.DanceHub}`,
  [App.Spanday]: `${repoPath}/app-build-config/service-brand/${App.Spanday}`,
};

export const realAppName: Record<App, string> = {
  [App.DanceHub]: `service-brand`,
  [App.Spanday]: `service-brand`,
};

export const appPath: Record<App, string> = {
  [App.DanceHub]: `${repoPath}/apps/${realAppName[App.DanceHub]}`,
  [App.Spanday]: `${repoPath}/apps/${realAppName[App.Spanday]}`,
};

export const getAppSyncPaths = ({ app, env }: { app: App; env: string }) => {
  if ([App.DanceHub, App.Spanday].includes(app)) {
    return [
      {
        src: `${appBuildConfigPath[app]}/assets`,
        dest: `${appPath[app]}/assets`,
      },
      {
        src: `${appBuildConfigPath[app]}/i18n`,
        dest: `${appPath[app]}/i18n`,
      },
      {
        src: `${appBuildConfigPath[app]}/google/${env.split('_')[0]}`,
        dest: `${appPath[app]}/google`,
      },
      {
        src: `${appBuildConfigPath[app]}/.env.${env}`,
        dest: `${appPath[app]}/.env`,
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
