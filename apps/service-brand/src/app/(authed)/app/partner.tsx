import {
  Accordion,
  ActionCard,
  CompactView,
  H2,
  Icon,
  ListItem,
  ListItemGroup,
  RegularText,
  SemiBoldText,
  Spinner,
} from '@symbiot-core-apps/ui';
import { useCurrentAccountState } from '@symbiot-core-apps/state';
import {
  capitalizeFirst,
  downloadArrayBuffer,
  emitHaptic,
  ShowNativeSuccessAlert,
  useI18n,
} from '@symbiot-core-apps/shared';
import { View, XStack } from 'tamagui';
import { Linking, Pressable } from 'react-native';
import React, { useCallback, useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  usePartnerPromoImage,
  usePartnerPromoPresentation,
} from '@symbiot-core-apps/api';
import { ScrollablePage } from '@symbiot-core-apps/ui2';

const downloadUrl = process.env['EXPO_PUBLIC_UNIVERSAL_DOWNLOAD_URL'] as string;
const websiteUrl = process.env['EXPO_PUBLIC_WEBSITE_URL'] as string;
const appName = process.env['EXPO_PUBLIC_APP_NAME'] as string;
const openMail = () =>
  Linking.openURL(`mailto:${process.env.EXPO_PUBLIC_SUPPORT_EMAIL}`);

export default () => {
  const { t } = useI18n();
  const { me } = useCurrentAccountState();
  const translatePrefix = `subscription.partner_instruction.${me?.partner?.offering}`;

  return (
    !!me?.partner && (
      <ScrollablePage>
        <CompactView gap="$5">
          <ListItemGroup
            title={t('shared.partner_program.promo_code.your_promo_code')}
          >
            <XStack
              paddingVertical="$3"
              justifyContent="space-between"
              gap="$2"
              alignItems="center"
            >
              <H2 textTransform="uppercase" numberOfLines={1}>
                {me.partner.promoCode}
              </H2>

              <CopyButton text={me.partner.promoCode.toUpperCase()} />
            </XStack>
          </ListItemGroup>

          <Accordion
            items={[
              {
                title: t(`${translatePrefix}.benefits.title`),
                content: (
                  <View gap="$4">
                    <RegularText>
                      {t(`${translatePrefix}.benefits.offering_description`, {
                        benefits: me.partner.benefits.join(', '),
                      })}
                    </RegularText>
                    <RegularText>
                      {t(`${translatePrefix}.benefits.features_description`)}
                    </RegularText>

                    <View gap="$2">
                      {(
                        t(
                          `subscription.paywall.${me?.partner?.offering}.benefits`,
                          {
                            returnObjects: true,
                          },
                        ) as {
                          title: string;
                          subtitle: string;
                        }[]
                      )?.map((benefit, index) => (
                        <SemiBoldText key={index}>
                          - {benefit.title}
                        </SemiBoldText>
                      ))}
                    </View>
                  </View>
                ),
              },
              {
                title: t(`${translatePrefix}.promo_code.title`),
                content: (
                  <View gap="$4">
                    <RegularText>
                      {t(`${translatePrefix}.promo_code.description`, {
                        benefits: me.partner.benefits.join(', '),
                      })}
                    </RegularText>
                    {(
                      t(`${translatePrefix}.promo_code.options`, {
                        returnObjects: true,
                        benefits: me.partner.benefits.join(', '),
                      }) as {
                        label: string;
                        description: string;
                      }[]
                    )?.map((option, index) => (
                      <View key={index} gap="$1">
                        <SemiBoldText>{option.label}</SemiBoldText>
                        <RegularText>{option.description}</RegularText>
                      </View>
                    ))}
                  </View>
                ),
              },
            ]}
          />

          {(!!downloadUrl || !!websiteUrl) && (
            <ListItemGroup
              title={t('shared.partner_program.useful_links.title')}
            >
              {!!downloadUrl && (
                <ListItem
                  label={t('shared.partner_program.useful_links.download_app')}
                  text={downloadUrl}
                  icon={<Icon name="Link" />}
                  iconAfter={<CopyButton text={downloadUrl} />}
                />
              )}
              {!!websiteUrl && (
                <ListItem
                  label={t('shared.partner_program.useful_links.website')}
                  text={websiteUrl}
                  icon={<Icon name="Link" />}
                  iconAfter={<CopyButton text={websiteUrl} />}
                />
              )}
            </ListItemGroup>
          )}

          <ListItemGroup
            title={t('shared.partner_program.promo_materials.title')}
          >
            <ListItem
              label={t('shared.partner_program.promo_materials.app_icon', {
                appName,
              })}
              icon={<Icon name="Gallery" />}
              iconAfter={<DownloadButton type="image" name="app-icon.png" />}
            />
            <ListItem
              label={t('shared.partner_program.promo_materials.app_logo', {
                appName,
              })}
              icon={<Icon name="Gallery" />}
              iconAfter={<DownloadButton type="image" name="app-logo.png" />}
            />
            <ListItem
              label={t('shared.partner_program.promo_materials.presentation', {
                appName,
              })}
              icon={<Icon name="FileText" />}
              iconAfter={
                <DownloadButton type="presentation" name="resentation.pdf" />
              }
            />
          </ListItemGroup>

          <ActionCard
            title={t('shared.partner_program.contact_us.title')}
            subtitle={t('shared.partner_program.contact_us.subtitle')}
            buttonLabel={t('shared.partner_program.contact_us.button.label')}
            buttonIcon={<Icon name="Letter" />}
            onPress={openMail}
          />
        </CompactView>
      </ScrollablePage>
    )
  );
};

const CopyButton = ({ text }: { text: string }) => {
  const { t } = useI18n();
  const onPress = useCallback(() => {
    emitHaptic();

    Clipboard.setString(String(text));

    ShowNativeSuccessAlert({
      title: t('shared.copied'),
    });
  }, [t, text]);

  return (
    <Pressable onPress={onPress}>
      <Icon name="Copy" />
    </Pressable>
  );
};

const DownloadButton = ({
  name,
  type,
}: {
  name: string;
  type: 'image' | 'presentation';
}) => {
  const { mutateAsync: downloadImage } = usePartnerPromoImage();
  const { mutateAsync: downloadPresentation } = usePartnerPromoPresentation();

  const [sharing, setSharing] = useState(false);

  const download = useCallback(async () => {
    emitHaptic();
    setSharing(true);

    try {
      const buffer = await (type === 'image'
        ? downloadImage({ name })
        : downloadPresentation());

      await downloadArrayBuffer(
        buffer,
        `${appName}-${type === 'presentation' ? capitalizeFirst(name) : name}`,
      );
    } finally {
      setSharing(false);
    }
  }, [type, name, downloadImage, downloadPresentation]);

  if (sharing) return <Spinner />;

  return (
    <Pressable onPress={download}>
      <Icon name="Import" />
    </Pressable>
  );
};
