import { select } from '@inquirer/prompts';
import { Env } from './env';

export enum BuildSource {
  eas = 'eas',
  local = 'local',
  store = 'store',
  deviceEas = 'device_eas',
  deviceLocal = 'device_local',
}

export const selectBuildSource = ({ env }: { env: Env }): Promise<BuildSource> =>
  BuildSource[process.env['NODE_BUILD_SOURCE']] ||
  select({
    message: 'Build Source',
    choices: [
      {
        name: 'Local',
        value: BuildSource.local,
      },
      {
        name: 'Local Device',
        value: BuildSource.deviceLocal,
      },
      {
        name: 'EAS',
        value: BuildSource.eas,
      },
      {
        name: 'EAS Device',
        value: BuildSource.deviceEas,
      },
      ...(env === Env.production
        ? [
            {
              name: 'Store',
              value: BuildSource.store,
            },
          ]
        : []),
    ],
  });
