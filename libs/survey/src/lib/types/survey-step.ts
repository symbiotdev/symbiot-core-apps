import { KeyboardType, TextInputProps } from 'react-native';
import * as yup from 'yup';
import { AppLinkType, ToggleGroupItem } from '@symbiot-core-apps/ui';

type SurveyStepElement<V> = {
  name: string;
  scheme: yup.Schema;
  defaultValue?: unknown;
  showWhen?: (formValue: V) => boolean;
};

export type SurveyStep<V> = {
  id: string;
  nextId: string | null;
  title: string;
  subtitle: string;
  skippable?: boolean;
  elements: (
    | {
        type: 'input';
        props: SurveyStepElement<V> & {
          placeholder: string;
          label?: string;
          maxLength?: number;
          keyboardType?: KeyboardType;
          enterKeyHint?: TextInputProps['enterKeyHint'];
        };
      }
    | {
        type: 'app-link';
        props: SurveyStepElement<V> & {
          type: AppLinkType;
          placeholder: string;
          label?: string;
          maxLength?: number;
          keyboardType?: KeyboardType;
          enterKeyHint?: TextInputProps['enterKeyHint'];
        };
      }
    | {
        type: 'toggle-group';
        props: SurveyStepElement<V> & {
          optionsLoading?: boolean;
          options?: ToggleGroupItem[];
        };
      }
    | {
        type: 'avatar';
        props: SurveyStepElement<V> & {
          stepValueKey: string;
        };
      }
    | {
        type: 'country';
        props: SurveyStepElement<V> & {
          label?: string;
          sheetLabel?: string;
          placeholder?: string;
        };
      }
    | {
        type: 'currency';
        props: SurveyStepElement<V> & {
          label?: string;
          sheetLabel?: string;
          placeholder?: string;
        };
      }
    | {
        type: 'weekdays-schedule';
        props: SurveyStepElement<V>;
      }
  )[];
};
