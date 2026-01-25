import { Env } from './env';
import { select } from '@inquirer/prompts';

export enum Increment {
  skip = 'skip',
  bump = 'bump',
  patch = 'patch',
  minor = 'minor',
  major = 'major',
}

export const selectIncrement = ({ env }: { env: Env }): Promise<Increment> =>
  env === Env.production &&
  select({
    message: 'Increment',
    choices: [
      {
        name: 'Skip',
        value: Increment.skip,
      },
      {
        name: 'Bump native version',
        value: Increment.bump,
      },
      {
        name: 'Patch',
        value: Increment.patch,
      },
      {
        name: 'Minor',
        value: Increment.minor,
      },
      {
        name: 'Major',
        value: Increment.major,
      },
    ],
  });
