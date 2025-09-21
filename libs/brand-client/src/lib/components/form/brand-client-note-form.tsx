import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { BrandClientNoteController } from '../controller/brand-client-note-controller';

type FormValue = {
  note: string;
};

export const BrandClientNoteForm = ({
  note,
  onUpdate,
}: FormValue & {
  onUpdate: (value: FormValue) => void;
}) => {
  const { control, handleSubmit } = useForm<FormValue>({
    defaultValues: {
      note,
    },
  });

  const update = useCallback(
    (value: FormValue) => note !== value.note && onUpdate(value),
    [note, onUpdate],
  );

  return (
    <BrandClientNoteController
      noLabel
      name="note"
      control={control}
      onBlur={handleSubmit(update)}
    />
  );
};
