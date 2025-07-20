import { View, ViewProps } from 'tamagui';
import { Image, ImageSource } from 'expo-image';
import { memo } from 'react';
import { shortName } from '@symbiot-core-apps/shared';
import { SemiBoldText } from '../text/text';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export const Avatar = memo(
  (
    props: {
      name: string;
      size: number;
      color?: string;
      url?: ImageSource | string;
    } & ViewProps,
  ) => {
    return (
      <View
        justifyContent="center"
        alignItems="center"
        position="relative"
        borderRadius={50}
        overflow="hidden"
        width={props.size}
        height={props.size}
        backgroundColor={props.color || '$background'}
        {...props}
      >
        {!!props.url && (
          <Image
            allowDownscaling={false}
            style={{
              flex: 1,
              width: '100%',
              backgroundColor: props.color,
            }}
            source={props.url}
            placeholder={{ blurhash }}
          />
        )}

        {!props.url && (
          <SemiBoldText fontSize={props.size / 3}>
            {shortName(props.name, '2-first-letters')}
          </SemiBoldText>
        )}
      </View>
    );
  },
);
