import { select } from '@inquirer/prompts';

export enum Env {
  developmentLocal = 'development_local',
  development = 'development',
  production = 'production',
}

export const selectEnv = ({
  ignoreLocal,
}: { ignoreLocal?: boolean } = {}): Promise<Env> =>
  Env[process.env['NODE_ENV']] ||
  select({
    message: 'Environment',
    choices: [
      ...(!ignoreLocal
        ? [
            {
              name: '[Local] Development',
              value: Env.developmentLocal,
            },
          ]
        : []),
      {
        name: 'Development',
        value: Env.development,
      },
      {
        name: 'Production',
        value: Env.production,
      },
    ],
  });
