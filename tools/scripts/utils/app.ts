import { select } from '@inquirer/prompts';
import { Platform } from './platform';

export enum App {
  Symbify = 'symbify',
  DanceHub = 'symbiothub-dance',
  Spanday = 'spanday',
}

export type AppConfig = {
  app: App;
  src: string;
  dest: string;
  name: string;
  label: string;
  dynamicAppJson: boolean;
  supportDevPlatforms: Platform[];
  supportDeployPlatforms: Platform[];
};

export const repoPath = process.cwd();
export const appBuildConfigPath = `${repoPath}/app-build-config`;
export const appConfig: Record<App, AppConfig> = {
  [App.Symbify]: {
    app: App.Symbify,
    label: 'Symbify',
    name: 'symbify',
    src: `${appBuildConfigPath}/symbify`,
    dest: `${repoPath}/apps/symbify`,
    dynamicAppJson: false,
    supportDevPlatforms: [Platform.web, Platform.ios, Platform.android],
    supportDeployPlatforms: [Platform.ios, Platform.android],
  },
  [App.DanceHub]: {
    app: App.DanceHub,
    label: 'DanceHub',
    name: 'service-brand',
    src: `${appBuildConfigPath}/service-brand/symbiothub-dance`,
    dest: `${repoPath}/apps/service-brand`,
    dynamicAppJson: true,
    supportDevPlatforms: [Platform.web, Platform.ios, Platform.android],
    supportDeployPlatforms: [Platform.ios, Platform.android],
  },
  [App.Spanday]: {
    app: App.Spanday,
    label: 'Spanday',
    name: 'service-brand',
    src: `${appBuildConfigPath}/service-brand/spanday`,
    dest: `${repoPath}/apps/service-brand`,
    dynamicAppJson: true,
    supportDevPlatforms: [Platform.web, Platform.ios, Platform.android],
    supportDeployPlatforms: [Platform.ios, Platform.android],
  },
};

export const getAppSyncPaths = ({ app, env }: { app: App; env: string }) => {
  const { src, dest } = appConfig[app];
  const baseSync = [
    {
      src: `${src}/.env.${env}`,
      dest: `${dest}/.env`,
    },
  ];

  if ([App.DanceHub, App.Spanday].includes(app)) {
    return [
      ...baseSync,
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
    ];
  } else {
    return baseSync;
  }
};

export const getAppConfig = async (): Promise<AppConfig> => {
  const appName = process.env['NODE_APP'];
  const apps = Object.keys(appConfig) as App[];

  const filteredApps = apps.filter((app) => appConfig[app].name === appName);

  if (appName && !filteredApps.length) {
    throw new Error(`Invalid app name: ${appName}`);
  } else if (filteredApps.length === 1) {
    return Promise.resolve(appConfig[filteredApps[0]]);
  } else {
    const app = await select<App>({
      message: 'Application',
      choices: apps.map((key) => ({
        name: appConfig[key].label,
        value: key,
      })),
    });

    return appConfig[app];
  }
};
