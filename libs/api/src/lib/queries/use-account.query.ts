import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Account, UpdateAccountData } from '../types/account';
import { requestWithAlertOnError } from '../utils/request';
import { ImagePickerAsset } from 'expo-image-picker';
import {
  convertImagePickerAssetsToUploadingFiles,
  generateFormDataFromUploadingFile,
} from '../utils/media';

export const useAccountMeQuery = () =>
  useQuery<Account, string>({
    queryKey: ['account-me'],
    queryFn: () => requestWithAlertOnError(axios.get('/api/account/me')),
  });

export const useAccountMeUpdate = () =>
  useMutation<Account, string, UpdateAccountData>({
    mutationFn: (data) =>
      requestWithAlertOnError(axios.put('/api/account/me', data)),
  });

export const useAccountMeAvatarUpdate = () =>
  useMutation<Account, string, ImagePickerAsset>({
    mutationFn: async (image) =>
      requestWithAlertOnError(
        axios.put(
          '/api/account/me/avatar',
          await generateFormDataFromUploadingFile(
            convertImagePickerAssetsToUploadingFiles([image])[0],
            'avatar',
          ),
        ),
      ),
  });

export const useAccountMeRemoveAvatar = () =>
  useMutation<Account, string>({
    mutationFn: () =>
      requestWithAlertOnError(axios.delete('/api/account/me/avatar')),
  });

export const useAccountRemoveMe = () =>
  useMutation({
    mutationFn: () => requestWithAlertOnError(axios.delete('/api/account/me')),
  });
