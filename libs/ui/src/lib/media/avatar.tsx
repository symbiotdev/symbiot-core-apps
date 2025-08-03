import { View, ViewProps } from 'tamagui';
import { Image, ImageSource } from 'expo-image';
import { memo } from 'react';
import { shortName } from '@symbiot-core-apps/shared';
import { SemiBoldText } from '../text/text';

const blurhash =
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
    size: number;
    color?: string;
    url?: ImageSource | string;
  }) => {
    return (
      <View
        justifyContent="center"
        alignItems="center"
        position="relative"
        borderRadius="100%"
        overflow="hidden"
        width={size}
        height={size}
        backgroundColor={url ? undefined : color || '$background'}
        {...viewProps}
      >
        {url ? (
          <Image
            allowDownscaling={false}
            style={{
              flex: 1,
              width: '100%',
              backgroundColor: url ? undefined : color,
            }}
            source={url}
            placeholder={{ blurhash }}
          />
        ) : (
          <SemiBoldText fontSize={size / 3}>
            {shortName(name, '2-first-letters')}
          </SemiBoldText>
        )}
      </View>
    );
  },
);
