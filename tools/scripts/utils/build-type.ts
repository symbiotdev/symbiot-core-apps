import { select } from '@inquirer/prompts';

export enum BuildType {
  livereaload = 'livereload',
  release = 'release',
}

export const selectBuildType = (): Promise<BuildType> =>
  BuildType[process.env['NODE_BUILD_TYPE']] ||
  select({
    message: 'Build Type',
    choices: [
      {
        name: 'Livereload',
        value: BuildType.livereaload,
      },
      {
        name: 'Release',
        value: BuildType.release,
      },
    ],
  });
