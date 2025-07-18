import { select } from '@inquirer/prompts';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
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

  console.log(`Deploying ${app}... 📦⬆️🌐`);

  const env = await select({
    message: 'Environment',
    choices: [
      {
        name: 'Development',
        value: 'development',
      },
      {
        name: 'Production',
        value: 'production',
      },
    ],
  });

  const build = await select({
    message: 'Build',
    choices: [
      {
        name: 'Local',
        value: 'machine',
      },
      {
        name: 'EAS',
        value: 'eas',
      },
      {
        name: 'Device',
        value: 'device',
      },
      ...(env === 'development'
        ? []
        : [
            {
              name: 'Store',
              value: 'store',
            },
          ]),
    ],
  });

  let incrementVersion;

  if (env === 'production') {
    incrementVersion = await select({
      message: 'Increment',
      choices: [
        {
          name: 'Skip',
          value: '',
        },
        {
          name: 'Major',
          value: 'major',
        },
        {
          name: 'Minor',
          value: 'minor',
        },
        {
          name: 'Patch',
          value: 'patch',
        },
      ],
    });
  }

  const profile = `${env}_${build}`;
  const buildCommand = `nx build ${app} -- --profile=${profile} --clear-cache ${
    build === 'machine' ? '--local' : ''
  }`;
  const submitCommand =
    build === 'store' && `nx submit ${app} -- --profile=${profile}`;
  const runCommand = `NODE_ENV=${env} nx reset && ${buildCommand} ${
    submitCommand ? `&& ${submitCommand}` : ''
  }`.trim();

  if (incrementVersion && (build === 'machine' || build === 'store')) {
    increment(app, incrementVersion);
  }

  spawn('sh', ['-c', runCommand], { stdio: 'inherit' });
})();

const increment = (app, type) => {
  const appConfigPath = `${__dirname}/../../apps/${app}/app.config.js`;
  const appConfig = fs.readFileSync(appConfigPath, 'utf8');

  fs.writeFileSync(
    appConfigPath,
    appConfig
      .replace(
        /version:\s*'(\d+)\.(\d+)\.(\d+)'/,
        (match, major, minor, patch) => {
          if (type === 'major') {
            major = parseInt(major, 10) + 1;
          }

          if (type === 'minor') {
            minor = parseInt(minor, 10) + 1;
          }

          if (type === 'patch') {
            patch = parseInt(patch, 10) + 1;
          }

          return `version: '${major}.${minor}.${patch}'`;
        }
      )
      .replace(/buildNumber:\s*'(\d+)'/, (match, p1) => {
        return `buildNumber: '${parseInt(p1, 10) + 1}'`;
      })
      .replace(/versionCode:\s*(\d+)/, (match, p1) => {
        return `versionCode: ${parseInt(p1, 10) + 1}`;
      }),
    'utf8'
  );
};
