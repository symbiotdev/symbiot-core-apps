import {
  Accordion,
  Button,
  Card,
  DocumentPicker,
  FileChip,
  FormView,
  H3,
  Icon,
  MediumText,
  PageView,
  RegularText,
  SemiBoldText,
} from '@symbiot-core-apps/ui';
import { View, XStack } from 'tamagui';
import {
  gendersWithoutEmptyOption,
  ImportBrandClient as TImportBrandClient,
  useBrandClientGendersReq,
  useBrandClientImportTemplateReq,
  useImportBrandClientsReq,
} from '@symbiot-core-apps/api';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { shareAsync } from 'expo-sharing';
import {
  cacheDirectory,
  readAsStringAsync,
  writeAsStringAsync,
} from 'expo-file-system';
import {
  downloadArrayBuffer,
  readFileWeb,
  useI18n,
} from '@symbiot-core-apps/shared';
import { router } from 'expo-router';
import { DocumentPickerAsset } from 'expo-document-picker';
import { parse } from 'papaparse';
import {
  ImportedClientsSummary,
  parseImportedClients,
} from '../utils/parse-imported-clients';
import { useAccountLimits } from '@symbiot-core-apps/account-subscription';
import { useCurrentBrandState } from '@symbiot-core-apps/state';

export const ImportBrandClient = () => {
  const { t } = useI18n();
  const { mutateAsync, isPending: templateLoading } =
    useBrandClientImportTemplateReq();
  const { mutateAsync: importClients, isPending: clientsImporting } =
    useImportBrandClientsReq();
  const { data: genders } = useBrandClientGendersReq();
  const { brand } = useCurrentBrandState();
  const { limits } = useAccountLimits();

  const [sharing, setSharing] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [file, setFile] = useState<DocumentPickerAsset>();
  const [fileError, setFileError] = useState<string>();
  const [clients, setClients] = useState<TImportBrandClient[]>([]);
  const [summary, setSummary] = useState<ImportedClientsSummary>();

  const downloadTemplate = useCallback(async () => {
    const buffer = await mutateAsync();
    const filename = `template_${Date.now()}.csv`;

    if (Platform.OS === 'web') {
      downloadArrayBuffer(buffer, filename);
    } else {
      try {
        setSharing(true);

        const uri = `${cacheDirectory}/template.csv`;
        const fileData = new TextDecoder('utf-8').decode(
          new Uint8Array(buffer),
        );

        await writeAsStringAsync(uri, fileData);

        await shareAsync(uri);
      } finally {
        setSharing(false);
      }
    }
  }, [mutateAsync]);

  const goToClients = useCallback(() => router.dismissTo('/clients'), []);

  const removeFile = useCallback(() => {
    setFile(undefined);
    setSummary(undefined);
    setClients([]);
  }, []);

  const handleFileError = useCallback((error: unknown) => {
    setFileError(JSON.stringify(error));
    setClients([]);
    setSummary(undefined);
  }, []);

  const onUploadFile = useCallback(
    async (assets: DocumentPickerAsset[]) => {
      if (!brand?.stats) return;

      let fileContent: string;
      const asset = assets[0];

      if (Platform.OS === 'web') {
        if (!asset.file) return;

        fileContent = await readFileWeb(asset.file);
      } else {
        fileContent = await readAsStringAsync(asset.uri);
      }

      setFile(asset);
      setFileError(undefined);

      parse(fileContent, {
        skipEmptyLines: true,
        complete: (parsedData: { data: Array<string[]> }) => {
          try {
            const { summary, clients } = parseImportedClients(
              parsedData.data,
              gendersWithoutEmptyOption(genders) || [],
            );

            setClients(
              limits.clients
                ? clients.slice(0, limits.clients - brand.stats.clients)
                : clients,
            );
            setSummary(summary);
          } catch (error) {
            handleFileError(error);
          }
        },
        error: (error: Error) => {
          handleFileError(error);
        },
      });
    },
    [brand?.stats, genders, handleFileError, limits.clients],
  );

  const uploadClients = useCallback(async () => {
    if (!clients.length) return;

    await importClients(clients);

    setUploaded(true);
  }, [clients, importClients]);

  return (
    <PageView scrollable withHeaderHeight>
      {uploaded ? (
        <FormView flex={1} justifyContent="center" gap="$5">
          <Icon name="SmileCircle" size={60} style={{ alignSelf: 'center' }} />

          <H3 textAlign="center">{t('brand_client.import.uploaded.title')}</H3>

          {summary && (
            <Card gap="$3" marginVertical="$2">
              <XStack alignItems="center">
                <RegularText>
                  {t('brand_client.import.uploaded.summary.total')}:
                </RegularText>
                <SemiBoldText> {summary.failed + summary.succeed}</SemiBoldText>
              </XStack>
              <XStack alignItems="center">
                <RegularText>
                  {t('brand_client.import.uploaded.summary.success')}:
                </RegularText>
                <SemiBoldText> {summary.succeed}</SemiBoldText>
              </XStack>
              <XStack alignItems="center">
                <RegularText>
                  {t('brand_client.import.uploaded.summary.failed')}:
                </RegularText>
                <SemiBoldText> {summary.failed}</SemiBoldText>
              </XStack>
            </Card>
          )}

          <Button
            label={t('brand_client.import.uploaded.button.label')}
            onPress={goToClients}
          />
        </FormView>
      ) : (
        <FormView gap="$1" flex={1} justifyContent="center">
          <View gap="$2">
            <View marginVertical="$5">
              <Icon name="Import" size={60} style={{ alignSelf: 'center' }} />

              <H3 marginTop="$3" textAlign="center">
                {t('brand_client.import.title')}
              </H3>
              <RegularText marginTop="$2" textAlign="center">
                {t('brand_client.import.subtitle')}
              </RegularText>
            </View>

            {!clients.length || !file ? (
              <DocumentPicker
                label={t('brand_client.import.upload.label')}
                type={[
                  'text/csv',
                  '.csv',
                  'application/vnd.ms-excel',
                  'application/csv',
                  'text/comma-separated-values',
                  'application/octet-stream',
                ]}
                error={fileError}
                onUpload={onUploadFile}
              />
            ) : (
              <>
                <FileChip
                  removable={!clientsImporting}
                  file={file}
                  onRemove={removeFile}
                />

                <Button
                  label={t('brand_client.import.upload.button.label')}
                  loading={clientsImporting}
                  disabled={clientsImporting}
                  onPress={uploadClients}
                />
              </>
            )}
          </View>

          {/*<MediumText*/}
          {/*  fontSize={12}*/}
          {/*  color="$placeholderColor"*/}
          {/*  marginHorizontal="$3"*/}
          {/*>*/}
          {/*  *{t('brand_client.import.guide.warning')}*/}
          {/*</MediumText>*/}

          <RegularText marginTop="$10" textAlign="center">
            {t('brand_client.import.suggestion')}
          </RegularText>

          <Accordion
            marginTop="$5"
            paddingVertical={0}
            items={[
              {
                title: t('brand_client.import.guide.title'),
                content: <ImportGuide />,
              },
            ]}
          />

          <Button
            marginTop="$2"
            label={t('brand_client.import.template.button.label')}
            loading={templateLoading || sharing}
            onPress={downloadTemplate}
          />
        </FormView>
      )}
    </PageView>
  );
};

const ImportGuide = () => {
  const { t } = useI18n();

  return (
    <View gap="$5" marginTop="$2">
      {(
        t('brand_client.import.guide.fields', { returnObjects: true }) as {
          name: string;
          options: string[];
        }[]
      ).map(({ name, options }, index) => (
        <View key={index} gap="$2">
          <MediumText>{name}</MediumText>

          {options.map((option, index) => (
            <RegularText key={index}>- {option}</RegularText>
          ))}
        </View>
      ))}
    </View>
  );
};
