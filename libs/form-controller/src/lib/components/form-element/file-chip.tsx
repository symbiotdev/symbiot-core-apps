import { filesize } from 'filesize';
import { useMemo } from 'react';
import { DocumentPickerAsset } from 'expo-document-picker';
import { View } from 'tamagui';
import { FormField } from '../wrapper/form-field';
import {
  ButtonIcon,
  Card,
  RegularText,
  SemiBoldText,
} from '@symbiot-core-apps/ui';

export const FileChip = ({
  file,
  label,
  removable,
  onRemove,
}: {
  file: File | DocumentPickerAsset;
  label?: string;
  removable?: boolean;
  onRemove?: () => void;
}) => {
  const fileSize = useMemo(
    () =>
      file?.size &&
      filesize(file.size, {
        base: 2,
        standard: 'jedec',
      }),
    [file.size],
  );

  return (
    <FormField label={label}>
      <Card flexDirection="row" gap="$3">
        <View gap="$1" flex={1}>
          <SemiBoldText flex={1} numberOfLines={1}>
            {file.name}
          </SemiBoldText>
          <RegularText color="$placeholderColor">{fileSize}</RegularText>
        </View>

        {removable && (
          <ButtonIcon
            hapticable
            iconName="TrashBinMinimalistic"
            backgroundColor="transparent"
            color="$error"
            onPress={onRemove}
          />
        )}
      </Card>
    </FormField>
  );
};
