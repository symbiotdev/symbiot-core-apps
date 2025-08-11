import { View } from 'tamagui';
import {
  Button,
  FormView,
  H2,
  Icon,
  IconName,
  PageView,
  RegularText,
} from '@symbiot-core-apps/ui';
import { memo } from 'react';

export const SurveyIntro = memo(
  ({
    iconName,
    title,
    subtitle,
    actionLabel,
    onStart,
  }: {
    iconName: IconName;
    title: string;
    subtitle: string;
    actionLabel: string;
    onStart: () => void;
  }) => (
    <PageView
      scrollable
      alignItems="center"
      justifyContent="center"
      gap="$10"
      animation="medium"
      opacity={1}
      enterStyle={{ opacity: 0 }}
      exitStyle={{ opacity: 0 }}
    >
      <FormView flex={1}>
        <View marginVertical="auto" alignItems="center" gap="$5">
          <Icon name={iconName} size={60} />

          <View gap="$2">
            <H2 textAlign="center">{title}</H2>
            <RegularText textAlign="center">{subtitle}</RegularText>
          </View>
        </View>

        <Button label={actionLabel} onPress={onStart} />
      </FormView>
    </PageView>
  ),
);
