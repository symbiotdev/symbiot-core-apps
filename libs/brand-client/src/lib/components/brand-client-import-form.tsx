import {
  Accordion,
  ActionCard,
  Button,
  DocumentPicker,
  FileChip,
  FormView,
  Icon,
  Label,
  Link,
  MediumText,
  PageView,
  RegularText,
  SemiBoldText,
} from '@symbiot-core-apps/ui';
import { useTranslation } from 'react-i18next';
import { View, XStack } from 'tamagui';
import {
  ImportBrandClient,
  useBrandClientImportTemplateQuery,
  useImportBrandClientsQuery,
} from '@symbiot-core-apps/api';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import { shareAsync } from 'expo-sharing';
import {
  cacheDirectory,
  readAsStringAsync,
  writeAsStringAsync,
} from 'expo-file-system';
import { downloadArrayBuffer, readFileWeb } from '@symbiot-core-apps/shared';
import { router } from 'expo-router';
import { DocumentPickerAsset } from 'expo-document-picker';
import { parse } from 'papaparse';
import {
  ImportedClientsSummary,
  parseImportedClients,
} from '../utils/parse-imported-clients';
import { useGenders } from '@symbiot-core-apps/state';

export const BrandClientImportForm = () => {
  const { t } = useTranslation();
  const { mutateAsync, isPending: templateLoading } =
    useBrandClientImportTemplateQuery();
  const { mutateAsync: importClients, isPending: clientsImporting } =
    useImportBrandClientsQuery();
  const { genders } = useGenders();

  const [sharing, setSharing] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [file, setFile] = useState<DocumentPickerAsset>();
  const [fileError, setFileError] = useState<string>();
  const [clients, setClients] = useState<ImportBrandClient[]>([]);
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
              genders || [],
            );

            setClients(clients);
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
    [genders, handleFileError],
  );

  const uploadClients = useCallback(async () => {
    if (!clients.length) return;

    await importClients(clients);

    setUploaded(true);
  }, [clients, importClients]);

  return (
    <PageView scrollable withHeaderHeight>
      {uploaded ? (
        <FormView flex={1} justifyContent="center" alignItems="center">
          <Icon name="SmileCircle" size={60} />

          {summary && (
            <View gap="$3" marginTop="$5">
              <XStack alignItems="center">
                <RegularText>
                  {t('brand.clients.import.uploaded.summary.total')}:
                </RegularText>
                <SemiBoldText> {summary.failed + summary.succeed}</SemiBoldText>
              </XStack>
              <XStack alignItems="center">
                <RegularText>
                  {t('brand.clients.import.uploaded.summary.success')}:
                </RegularText>
                <SemiBoldText> {summary.succeed}</SemiBoldText>
              </XStack>
              <XStack alignItems="center">
                <RegularText>
                  {t('brand.clients.import.uploaded.summary.failed')}:
                </RegularText>
                <SemiBoldText> {summary.failed}</SemiBoldText>
              </XStack>
            </View>
          )}

          <Button
            marginTop="$10"
            label={t('brand.clients.import.uploaded.button.label')}
            onPress={goToClients}
          />
        </FormView>
      ) : (
        <FormView gap="$5">
          {!clients.length || !file ? (
            <DocumentPicker
              label={t('brand.clients.import.upload.label')}
              uploadLabel={t('brand.clients.import.upload.file')}
              type={['text/csv', 'application/vnd.ms-excel', '.csv']}
              error={fileError}
              onUpload={onUploadFile}
            />
          ) : (
            <View gap="$2">
              <FileChip
                label={t('brand.clients.import.upload.label')}
                removable={!clientsImporting}
                file={file}
                onRemove={removeFile}
              />

              <Button
                label={t('brand.clients.import.upload.button.label')}
                loading={clientsImporting}
                disabled={clientsImporting}
                onPress={uploadClients}
              />
            </View>
          )}

          <View gap="$2">
            <Label paddingHorizontal="$4">
              {t('brand.clients.import.guide.subtitle')}
            </Label>

            <Accordion
              items={[
                {
                  title: t('brand.clients.import.guide.title'),
                  content: <ImportGuide />,
                },
              ]}
            />
          </View>

          <ActionCard
            title={t('brand.clients.import.template.title')}
            subtitle={t('brand.clients.import.template.subtitle')}
            buttonLabel={t('brand.clients.import.template.button.label')}
            buttonLoading={templateLoading || sharing}
            buttonIcon={<Icon name="Import" />}
            onActionPress={downloadTemplate}
          />
        </FormView>
      )}
    </PageView>
  );
};

const ImportGuide = () => {
  const { t } = useTranslation();

  const openHelp = useCallback(() => {
    router.navigate('/app/help-feedback');
  }, []);

  return (
    <View gap="$5" marginTop="$2">
      {(
        t('brand.clients.import.guide.fields', { returnObjects: true }) as {
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

      <MediumText fontSize={12} color="$placeholderColor">
        *{t('brand.clients.import.guide.warning')}
      </MediumText>

      <MediumText>
        {t('brand.clients.import.guide.help.title')}{' '}
        <Link onPress={openHelp}>
          {t('brand.clients.import.guide.help.button.label')}
        </Link>
      </MediumText>
    </View>
  );
};
