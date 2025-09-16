import {
  AnimatableNumericValue,
  KeyboardType,
  TextInputProps,
} from 'react-native';
import * as yup from 'yup';
import {
  AppLinkType,
  DurationPickerUnit,
  PickerItem,
  ToggleGroupItem,
} from '@symbiot-core-apps/ui';

type SurveyStepElement<V> = {
  name: string;
  scheme: yup.Schema;
  defaultValue?: unknown;
  required?: boolean;
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
          type?: 'email' | 'password' | 'text' | 'numeric';
          regex?: RegExp;
          maxLength?: number;
          keyboardType?: KeyboardType;
          enterKeyHint?: TextInputProps['enterKeyHint'];
        };
      }
    | {
        type: 'textarea';
        props: SurveyStepElement<V> & {
          placeholder: string;
          label?: string;
          maxLength?: number;
          keyboardType?: KeyboardType;
          enterKeyHint?: TextInputProps['enterKeyHint'];
        };
      }
    | {
        type: 'phone';
        props: SurveyStepElement<V> & {
          label?: string;
          placeholder: string;
          enterKeyHint?: TextInputProps['enterKeyHint'];
        };
      }
    | {
        type: 'price-input';
        props: SurveyStepElement<V> & {
          label?: string;
          placeholder: string;
        };
      }
    | {
        type: 'switch';
        props: SurveyStepElement<V> & {
          label?: string;
          description?: string;
        };
      }
    | {
        type: 'email';
        props: SurveyStepElement<V> & {
          label?: string;
          placeholder: string;
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
          label?: string;
          multiselect?: boolean;
          allowEmpty?: boolean;
          optionsLoading?: boolean;
          optionsError?: string | null;
          options?: ToggleGroupItem[];
        };
      }
    | {
        type: 'select-picker';
        props: SurveyStepElement<V> & {
          label?: string;
          sheetLabel?: string;
          placeholder?: string;
          optionsLoading?: boolean;
          noCheckedValue?: string;
          showSelectedDescription?: boolean;
          optionsError?: string | null;
          options?: PickerItem[];
        };
      }
    | {
        type: 'avatar';
        props: SurveyStepElement<V> & {
          stepValueKey: string;
          borderRadius?: AnimatableNumericValue | string | undefined;
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
        type: 'us-state';
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
        type: 'address';
        props: SurveyStepElement<V> & {
          label?: string;
          placeholder?: string;
          enterKeyHint?: TextInputProps['enterKeyHint'];
        };
      }
    | {
        type: 'weekdays-schedule';
        props: SurveyStepElement<V> & {
          label?: string;
        };
      }
    | {
        type: 'date-picker';
        props: SurveyStepElement<V> & {
          label?: string;
          placeholder?: string;
        };
      }
    | {
        type: 'duration-picker';
        props: SurveyStepElement<V> & {
          units: DurationPickerUnit[];
          label?: string;
          placeholder?: string;
        };
      }
  )[];
};
