import { Platform } from './platform';
import { BuildSource } from './build-source';
import { App, appConfig } from './app';
import { Env } from './env';
import { BuildType } from './build-type';

export const getPrebuildCommand = ({
  app,
  platform,
}: {
  app: App;
  platform: Platform;
}) => {
  const { name } = appConfig[app];

  return `nx run ${name}:prebuild -- --platform=${platform}`;
};

export const getBuildCommand = ({
  app,
  platform,
  profile,
  buildSource,
}: {
  app: App;
  profile: string;
  platform: Platform;
  buildSource: BuildSource;
}) => {
  const { name } = appConfig[app];

  return `nx run ${name}:build -- --profile=${profile} --platform=${platform} --clear-cache ${
    buildSource.indexOf('local') !== -1 ? '--local' : ''
  }`;
};

export const getSubmitCommand = ({
  app,
  profile,
  buildSource,
}: {
  app: App;
  profile: string;
  buildSource: BuildSource;
}) => {
  const { name } = appConfig[app];

  return buildSource === BuildSource.store
    ? `nx submit ${name} -- --profile=${profile}`
    : 'echo "Ready!"';
};

export const getExportCommand = ({ app }: { app: App }) => {
  const { name } = appConfig[app];

  return `nx run ${name}:export --platform=web --clear --skip-nx-cache`;
};

export const getStartCommand = ({
  app,
  env,
  platform,
  buildType,
}: {
  app: App;
  env: Env;
  platform: Platform;
  buildType: BuildType;
}) => {
  const { name } = appConfig[app];
  const isRelease = env === Env.production && buildType === BuildType.release;

  if (platform !== Platform.web) {
    const prebuildCommand = getPrebuildCommand({ app, platform });
    const configuration = isRelease
      ? `${
          platform === Platform.ios
            ? '--configuration=Release'
            : '--variant=release'
        }`
      : '';

    return `nx reset && ${prebuildCommand} && nx run ${name}:run-${platform} -- --device ${configuration}`;
  } else {
    const additionalParams = isRelease
      ? '-- --no-dev --minify --clear'
      : '-- --clear';

    return `nx reset && nx start ${name} ${additionalParams}`;
  }
};
