import { AnyBrandClientMembership, BrandClient } from '@symbiot-core-apps/api';
import {
  AdaptivePopoverRef,
  Avatar,
  ButtonIcon,
  FormView,
  H3,
  Link,
  MapsTrigger,
  PageView,
  RegularText,
} from '@symbiot-core-apps/ui';
import { DateHelper } from '@symbiot-core-apps/shared';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import { View, XStack } from 'tamagui';
import React, { useCallback, useRef } from 'react';
import { Linking } from 'react-native';
import { BrandClientBalance } from './brand-client-balance';
import { BrandClientNote } from './brand-client-note';
import { BrandClientHistory } from './brand-client-history';
import { BrandClientTopUpBalance } from './brand-client-top-up-balance';
import { router } from 'expo-router';

export const BrandClientProfile = ({ client }: { client: BrandClient }) => {
  const { me } = useCurrentAccountState();

  const topUpBalanceRef = useRef<AdaptivePopoverRef>(null);

  const onPhonePress = useCallback(
    () => Linking.openURL(`tel:${client.phones[0]}`),
    [client.phones],
  );

  const onEmailPress = useCallback(
    () => Linking.openURL(`mailto:${client.emails[0]}`),
    [client.emails],
  );

  const name = `${client.firstname} ${client.lastname}`;

  const onPressMembership = useCallback(
    (membership: AnyBrandClientMembership) => {
      router.push(`/clients/${client.id}/memberships/${membership.id}/update`);
    },
    [client.id],
  );

  return (
    <PageView scrollable withHeaderHeight>
      <FormView gap="$5">
        <View alignItems="center" gap="$2">
          <Avatar
            color="$background1"
            name={name}
            url={client.avatar?.xsUrl}
            size={100}
          />

          <H3 textAlign="center">{name}</H3>

          {(client.gender || client.birthday) && (
            <RegularText color="$placeholderColor" textAlign="center">
              {[
                client.birthday
                  ? DateHelper.format(
                      client.birthday,
                      me?.preferences?.dateFormat,
                    )
                  : '',
                client.gender?.label,
              ]
                .filter(Boolean)
                .join(' · ')}
            </RegularText>
          )}

          {client.addresses?.map((address, index) => (
            <MapsTrigger
              key={index}
              address={address}
              trigger={<Link>{address}</Link>}
            />
          ))}

          <XStack justifyContent="center" gap="$2" marginTop="$2">
            <ButtonIcon
              iconName="Phone"
              size={40}
              iconSize={20}
              iconStyle={{ marginLeft: -2, marginBottom: -2 }}
              disabled={!client.phones?.length}
              onPress={onPhonePress}
            />

            <ButtonIcon
              iconName="Letter"
              size={40}
              iconSize={20}
              disabled={!client.emails?.length}
              onPress={onEmailPress}
            />

            <BrandClientTopUpBalance
              client={client}
              popoverRef={topUpBalanceRef}
              trigger={<ButtonIcon iconName="Wallet" size={40} iconSize={20} />}
            />
          </XStack>
        </View>

        <BrandClientBalance
          client={client}
          showTopUpBalance={!client.memberships?.length}
          onPressMembership={onPressMembership}
        />
        <BrandClientNote client={client} />
        <BrandClientHistory client={client} />
      </FormView>
    </PageView>
  );
};
