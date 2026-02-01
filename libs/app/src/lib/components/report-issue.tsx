import { Button, CompactView, PageView } from '@symbiot-core-apps/ui';
import { useForm } from 'react-hook-form';
import { TextController } from '@symbiot-core-apps/form-controller';
import {
  goBack,
  ShowNativeSuccessAlert,
  useI18n,
} from '@symbiot-core-apps/shared';
import { useCallback } from 'react';
import { useCreateIssueReq } from '@symbiot-core-apps/api';

type FormData = {
  message: string;
};

export const ReportIssue = () => {
  const { t } = useI18n();
  const { mutateAsync, isPending } = useCreateIssueReq();
  const { control, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      message: '',
    },
  });

  const send = useCallback(
    async (data: FormData) => {
      setValue('message', '');

      await mutateAsync(data);

      ShowNativeSuccessAlert({
        title: t('shared.report_issue.sent.title'),
        subtitle: t('shared.report_issue.sent.subtitle'),
        duration: 5,
      });

      goBack();
    },
    [mutateAsync, setValue, t],
  );

  return (
    <PageView scrollable withHeaderHeight withKeyboard>
      <CompactView flexGrow={1}>
        <TextController
          name="message"
          control={control}
          label={t('shared.report_issue.form.message.label')}
          placeholder={t('shared.report_issue.form.message.placeholder')}
          rules={{
            required: {
              value: true,
              message: t('shared.report_issue.form.message.error.required'),
            },
          }}
        />

        <Button
          marginTop="auto"
          loading={isPending}
          label={t('shared.send')}
          onPress={handleSubmit(send)}
        />
      </CompactView>
    </PageView>
  );
};
