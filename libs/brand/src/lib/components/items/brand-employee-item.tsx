import { BrandEmployee } from '@symbiot-core-apps/api';
import { emitHaptic } from '@symbiot-core-apps/shared';
import { router } from 'expo-router';
import {
  Avatar,
  FormView,
  Icon,
  MediumText,
  RegularText,
} from '@symbiot-core-apps/ui';
import { View, ViewProps } from 'tamagui';

export const BrandEmployeeItem = ({
  employee,
  navigateTo,
  ...viewProps
}: ViewProps & {
  employee: BrandEmployee;
  navigateTo?: 'update' | 'profile';
}) => {
  return (
    <FormView
      {...viewProps}
      alignItems="center"
      gap="$4"
      cursor="pointer"
      flexDirection="row"
      pressStyle={{ opacity: 0.8 }}
      onPress={() => {
        emitHaptic();
        router.push(`/employees/${employee.id}/${navigateTo || 'profile'}`);
      }}
    >
      <Avatar
        name={employee.name}
        size={40}
        url={employee.avatarXsUrl}
        color={employee.avatarColor}
      />

      <View gap="$1" flex={1}>
        <MediumText numberOfLines={1}>{employee.name}</MediumText>
        <RegularText
          color="$placeholderColor"
          numberOfLines={1}
          lineHeight={20}
        >
          {employee.role}
        </RegularText>
      </View>

      <Icon name="ArrowRight" />
    </FormView>
  );
};
