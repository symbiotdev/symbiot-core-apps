import { input, select } from '@inquirer/prompts';
import { spawn } from 'child_process';

(async () => {
  const plugin = await select({
    message: 'Select plugin',
    choices: [
      {
        name: 'Expo',
        value: '@nx/expo',
      },
    ],
  });

  const type = await select({
    message: 'Select type',
    choices: [
      {
        name: 'Application',
        value: 'app',
      },
      {
        name: 'Library',
        value: 'library',
      },
    ],
  });

  const name = await input({ message: 'Enter name' });

  const directory = type === 'app' ? 'apps' : 'libs';

  spawn(
    'sh',
    ['-c', `nx g ${plugin}:${type} ${name} --directory=${directory}/${name}`],
    {
      stdio: 'inherit',
    }
  );
})();
