import { useMutation } from '@tanstack/react-query';
import { BrandLocation } from '../types/brand-location';
import { ImagePickerAsset } from 'expo-image-picker';
import axios from 'axios';
import { generateFormData } from '../utils/media';
import { refetchQueriesByLocationChanges } from './use-brand-location.query';
import { requestWithAlertOnError } from '../utils/request';

export enum BrandLocationGalleryQueryKey {}

export const useUploadBrandLocationGalleryImagesQuery = () =>
  useMutation<BrandLocation, string, { images: ImagePickerAsset[] }>({
    mutationFn: async (data) => {
      const location = await requestWithAlertOnError<BrandLocation>(
        axios.post(
          '/api/brand-location-gallery',
          await generateFormData(data, ['images']),
        ),
      );

      if (location) {
        await refetchQueriesByLocationChanges(location);
      }

      return location;
    },
  });

export const useRemoveBrandLocationGalleryImagesQuery = () =>
  useMutation<BrandLocation, string, { id: string }>({
    mutationFn: async ({ id }) => {
      const location = await requestWithAlertOnError<BrandLocation>(
        axios.delete(`/api/brand-location-gallery/${id}`),
      );

      if (location) {
        await refetchQueriesByLocationChanges(location);
      }

      return location;
    },
  });
