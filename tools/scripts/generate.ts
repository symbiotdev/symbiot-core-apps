import { input, select } from '@inquirer/prompts';
import { spawn } from 'child_process';

enum GenerateEntity {
  app = 'app',
  library = 'library',
}

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

  const type = await select<GenerateEntity>({
    message: 'Select type',
    choices: [
      {
        name: 'Application',
        value: GenerateEntity.app,
      },
      {
        name: 'Library',
        value: GenerateEntity.library,
      },
    ],
  });

  const name = await input({ message: 'Enter name' });
  const directory = type === GenerateEntity.app ? 'apps' : 'libs';

  spawn(`nx g ${plugin}:${type} ${name} --directory=${directory}/${name}`, {
    stdio: 'inherit',
    shell: true,
  });
})();
