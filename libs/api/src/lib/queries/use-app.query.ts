import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { requestWithAlertOnError } from '../utils/request';
import { AppConfig } from '../types/app-config';

export enum AppQueryKey {
  config = 'app-config',
}

export const useAppConfigQuery = () =>
  useQuery<AppConfig, string>({
    queryKey: [AppQueryKey.config],
    queryFn: () => requestWithAlertOnError(axios.get('/api/app/config')),
  });
