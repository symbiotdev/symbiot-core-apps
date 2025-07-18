import { select } from '@inquirer/prompts';
import { spawn } from 'child_process';

(async () => {
  console.log(`Exporting... 🌐⬆️`);

  const app =
    process.env['NODE_APP'] ||
    (await select({
      message: 'Application',
      choices: [
        {
          name: 'DanceHub',
          value: 'dance-hub',
        },
        {
          name: 'Spanday',
          value: 'spanday',
        },
        {
          name: 'Symbiot',
          value: 'symbiot',
        },
      ],
    }));

  const env = await select({
    message: 'Environment',
    choices: [
      {
        name: 'Development',
        value: 'dev',
      },
      {
        name: 'Production',
        value: 'prod',
      },
    ],
  });

  spawn(
    `NODE_ENV=${env} nx run ${app}:export --platform=web --clear --skip-nx-cache`,
    { stdio: 'inherit', shell: true }
  );
})();
