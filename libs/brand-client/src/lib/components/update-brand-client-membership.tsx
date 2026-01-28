import {
  AnyBrandClientMembership,
  BrandClientVisitBasedMembership,
  BrandMembershipType,
  UpdateBrandClientMembership as TUpdateBrandClientMembership,
  useModalUpdateByQueryParamsForm,
  useUpdateBrandClientMembershipReq,
} from '@symbiot-core-apps/api';
import {
  ButtonIcon,
  defaultPageVerticalPadding,
  FrameView,
  Icon,
  ListItem,
  ListItemGroup,
  PageView,
  SlideSheetModal,
} from '@symbiot-core-apps/ui';
import { BrandClientMembershipItem } from '@symbiot-core-apps/brand';
import React, { useCallback } from 'react';
import { DateHelper, useI18n } from '@symbiot-core-apps/shared';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import { SingeElementForm } from '@symbiot-core-apps/form-controller';
import { BrandClientBirthdayController } from './controller/brand-client-membership-end-at-controller';
import { View, XStack } from 'tamagui';
import { BrandClientMembershipVisitsController } from './controller/brand-client-membership-visits-controller';

export const UpdateBrandClientMembership = ({
  clientId,
  membership,
}: {
  clientId: string;
  membership: AnyBrandClientMembership;
}) => {
  return (
    <PageView scrollable withHeaderHeight>
      <FrameView>
        <BrandClientMembershipItem alignSelf="center" membership={membership} />

        {membership.type === BrandMembershipType.visits && (
          <Visits clientId={clientId} membership={membership} />
        )}

        <ListItemGroup>
          <EndAt clientId={clientId} membership={membership} />
        </ListItemGroup>
      </FrameView>
    </PageView>
  );
};

const Visits = ({
  clientId,
  membership,
}: {
  clientId: string;
  membership: BrandClientVisitBasedMembership;
}) => {
  const { mutateAsync, isPending } = useUpdateBrandClientMembershipReq();

  const update = useCallback(
    (data: TUpdateBrandClientMembership) =>
      mutateAsync({
        clientId,
        membershipId: membership.id,
        data,
      }),
    [clientId, membership.id, mutateAsync],
  );

  return (
    <SingeElementForm
      name="visits"
      value={membership.visits}
      controllerProps={{
        loading: isPending,
        disabled: isPending,
        includeZero: true,
      }}
      onUpdate={update}
      Controller={BrandClientMembershipVisitsController}
    />
  );
};

const EndAt = ({
  clientId,
  membership,
}: {
  clientId: string;
  membership: AnyBrandClientMembership;
}) => {
  const { me } = useCurrentAccountState();
  const { t } = useI18n();
  const { value, modalVisible, openModal, closeModal, updateValue } =
    useModalUpdateByQueryParamsForm<
      { clientId: string; membershipId: string },
      AnyBrandClientMembership,
      { endAt: string | null },
      TUpdateBrandClientMembership
    >({
      params: { clientId, membershipId: membership.id },
      query: useUpdateBrandClientMembershipReq,
      initialValue: {
        endAt: membership.endAt || null,
      },
      dataRequestFormatted: (value) => {
        if (value.endAt) {
          value.endAt = DateHelper.endOfDay(value.endAt).toISOString();
        }

        return value;
      },
    });

  const removeEndAt = useCallback(
    () =>
      updateValue({
        endAt: null,
      }),
    [updateValue],
  );

  return (
    <>
      <ListItem
        icon={<Icon name="Calendar" />}
        label={t('brand_client_membership.profile.groups.end_date.title')}
        text={
          value.endAt
            ? DateHelper.format(value.endAt, me?.preferences?.dateFormat)
            : t('shared.not_specified')
        }
        onPress={openModal}
      />

      <SlideSheetModal
        scrollable
        headerTitle={t('brand_client_membership.profile.groups.end_date.title')}
        visible={modalVisible}
        onClose={closeModal}
      >
        <FrameView gap="$5" paddingVertical={defaultPageVerticalPadding}>
          <XStack gap="$3" alignItems="center" width="100%">
            <View flex={1}>
              <SingeElementForm
                name="endAt"
                value={value.endAt}
                controllerProps={{
                  noLabel: true,
                }}
                onUpdate={updateValue}
                Controller={BrandClientBirthdayController}
              />
            </View>

            {!!value.endAt && (
              <ButtonIcon
                iconName="TrashBinMinimalistic"
                type="danger"
                onPress={removeEndAt}
              />
            )}
          </XStack>
        </FrameView>
      </SlideSheetModal>
    </>
  );
};
