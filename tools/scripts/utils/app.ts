import { select } from '@inquirer/prompts';

export enum App {
  DanceHub = 'symbiothub-dance',
  Spanday = 'spanday',
}

const repoPath = process.cwd();

export const realAppName: Record<App, string> = {
  [App.DanceHub]: `service-brand`,
  [App.Spanday]: `service-brand`,
};

export const appBuildConfigPath: Record<App, string> = {
  [App.DanceHub]: `${repoPath}/app-build-config/service-brand/${App.DanceHub}`,
  [App.Spanday]: `${repoPath}/app-build-config/service-brand/${App.Spanday}`,
};

export const appDestinationPath: Record<App, string> = {
  [App.DanceHub]: `${repoPath}/apps/service-brand`,
  [App.Spanday]: `${repoPath}/apps/service-brand`,
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
