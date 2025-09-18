import { View, ViewProps } from 'tamagui';
import { Image, ImageSource } from 'expo-image';
import { memo } from 'react';
import { shortName } from '@symbiot-core-apps/shared';
import { SemiBoldText } from '../text/text';
import { DimensionValue } from 'react-native';

export type AvatarSize =
  | number
  | { width: DimensionValue; height: DimensionValue };

export const avatarBlurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export const Avatar = memo(
  ({
    name,
    size,
    color,
    url,
    ...viewProps
  }: ViewProps & {
    name: string;
    size: AvatarSize;
    color?: string;
    url?: ImageSource | string;
  }) => {
    const width = typeof size === 'number' ? size : size.width;
    const height = typeof size === 'number' ? size : size.height;

    return (
      <View
        justifyContent="center"
        alignItems="center"
        position="relative"
        borderRadius="100%"
        overflow="hidden"
        width={width}
        height={height}
        backgroundColor={url ? undefined : color || '$background'}
        {...viewProps}
      >
        {url ? (
          <Image
            allowDownscaling={false}
            source={url}
            placeholder={{
              blurhash: avatarBlurhash,
            }}
            style={{
              flex: 1,
              width: '100%',
              backgroundColor: url ? undefined : color,
            }}
          />
        ) : (
          <SemiBoldText fontSize={typeof height === 'number' ? height / 3 : 20}>
            {shortName(name, '2-first-letters')}
          </SemiBoldText>
        )}
      </View>
    );
  },
);
