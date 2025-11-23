import type { MutationFunction } from '@tanstack/react-query';
import { useMutation as useTanStackMutation } from '@tanstack/react-query';
import type { DefaultError } from '@tanstack/query-core';
import {
  requestWithAlertOnError,
  requestWithStringError,
} from '../utils/request';

export function useMutation<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TOnMutateResult = unknown,
>({
  mutationFn,
  showAlert,
}: {
  mutationFn: MutationFunction<TData, TVariables>;
  showAlert?: boolean;
}) {
  return useTanStackMutation<TData, TError, TVariables, TOnMutateResult>({
    mutationFn: (data, context) =>
      (showAlert
        ? requestWithAlertOnError<TData>
        : requestWithStringError<TData>)(mutationFn(data, context)),
  });
}
