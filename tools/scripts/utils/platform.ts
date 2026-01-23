import { select } from '@inquirer/prompts';

export enum Platform {
  web = 'web',
  ios = 'ios',
  android = 'android',
}

export const selectPlatform = ({
  platforms,
  nativeOnly,
}: {
  platforms: Platform[];
  nativeOnly?: boolean;
}): Promise<Platform> => {
  const selectedPlatform = Platform[process.env['NODE_PLATFORM']] as Platform;

  if (selectedPlatform) return Promise.resolve(selectedPlatform);

  const filteredPlatforms = platforms.filter((platform) =>
    nativeOnly ? platform !== Platform.web : true,
  );

  if (!filteredPlatforms.length) throw new Error(`No supported platform`);

  return select({
    message: 'Platform',
    choices: filteredPlatforms.map((platform) => ({
      name: platform,
      value: platform,
    })),
  });
};
