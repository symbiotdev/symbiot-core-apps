import { select } from '@inquirer/prompts';
import { spawn } from 'child_process';

(async () => {
  const app = process.env['NODE_APP'];

  console.log(`Starting ${app}... 🚀🚀🚀`);

  const env = await select({
    message: 'Environment',
    choices: [
      {
        name: 'Machine',
        value: 'machine'
      },
      {
        name: 'Development',
        value: 'development'
      },
      {
        name: 'Production',
        value: 'production'
      }
    ]
  });

  const platform = await select({
    message: 'Platform',
    choices: [
      {
        name: 'Web',
        value: 'web'
      },
      {
        name: 'IOS',
        value: 'ios'
      },
      {
        name: 'Android',
        value: 'android'
      }
    ]
  });

  const runCommand =
    platform !== 'web'
      ? `nx reset && NODE_ENV=${env} nx run ${app}:prebuild --install=false --platform=${platform} && NODE_ENV=${env} nx run ${app}:run-${platform} --device`
      : `nx reset && NODE_ENV=${env} nx start ${app} --clear`;

  spawn('sh', ['-c', runCommand], { stdio: 'inherit' });
})();
