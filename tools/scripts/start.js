import { select } from '@inquirer/prompts';
import { spawn } from 'child_process';

(async () => {
  console.log(`Starting... 🚀🚀`);

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
        name: 'Local',
        value: 'loc',
      },
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

  const platform = await select({
    message: 'Platform',
    choices: [
      {
        name: 'Web',
        value: 'web',
      },
      {
        name: 'IOS',
        value: 'ios',
      },
      {
        name: 'Android',
        value: 'android'
      },
    ],
  });

  const reset = `nx reset && NODE_ENV=${env}`;
  const buildType =
    env === 'prod'
      ? platform === 'ios'
        ? '--configuration=Release'
        : '--variant=release'
      : '';
  const runCommand =
    platform !== 'web'
      ? `${reset} nx run ${app}:prebuild --platform=${platform} && NODE_ENV=${env} nx run ${app}:run-${platform} -- --device ${buildType}`
      : `${reset} nx start ${app} --clear ${
          env === 'prod' ? '-- --no-dev --minify' : ''
        }`;

  spawn(runCommand, { stdio: 'inherit', shell: true });
})();
