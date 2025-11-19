import { refetchQueriesByChanges } from '../utils/query';
import {
  AnyBrandBooking,
  BrandBookingSlot,
  BrandBookingType,
  CreateServiceBrandBooking,
  CreateServiceBrandBookingClient,
  CreateUnavailableBrandBooking,
  ServiceBrandBooking,
  ServiceBrandBookingSlotsParams,
  UpdateBrandBooking,
  UpdateServiceBrandBooking,
  UpdateServiceBrandBookingClient,
} from '../types/brand-booking';
import { useInfiniteQueryWrapper } from '../hooks/use-infinite-query-wrapper';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  requestWithAlertOnError,
  requestWithStringError,
} from '../utils/request';
import axios from 'axios';
import { queryClient } from '../utils/client';
import { getBrandBookingType } from '../utils/brand-booking';
import { PaginationList, PaginationListParams } from '../types/pagination';

export enum BrandBookingQueryKey {
  unavailableCurrentList = 'brand-booking-unavailable-current-list',
  serviceCurrentList = 'brand-booking-service-current-list',
  periodList = 'brand-booking-period-list',
  detailedById = 'brand-booking-detailed-by-id',
  slotsByService = 'brand-booking-slots-by-service',
}

const refetchQueriesByBookingChanges = async (
  entities: {
    id: string;
    data: AnyBrandBooking;
  }[],
  refetchList = true,
) =>
  refetchQueriesByChanges<AnyBrandBooking>({
    refetchList,
    entities,
    queryKeys: {
      byId: [BrandBookingQueryKey.detailedById],
      list: entities.some(
        ({ data }) =>
          getBrandBookingType(data) === BrandBookingType.unavailable,
      )
        ? [
            BrandBookingQueryKey.unavailableCurrentList,
            BrandBookingQueryKey.periodList,
          ]
        : [
            BrandBookingQueryKey.serviceCurrentList,
            BrandBookingQueryKey.periodList,
          ],
    },
  });

export const useBrandBookingCurrentListReq = ({
  start,
  params,
}: {
  start: Date;
  params?: PaginationListParams;
}) =>
  useInfiniteQueryWrapper<AnyBrandBooking>({
    storeInitialData: true,
    refetchOnMount: true,
    afterKeys: ['id', 'start'],
    apUrl: '/api/brand-booking',
    queryKey: [start, params],
    params: {
      ...params,
      start,
    },
  });

export const useBrandBookingPeriodListReq = (props?: {
  params: PaginationListParams & {
    start: Date;
    end: Date;
    location?: string;
  };
}) =>
  useQuery<PaginationList<AnyBrandBooking>>({
    queryKey: [BrandBookingQueryKey.periodList, props?.params],
    queryFn: () =>
      requestWithAlertOnError(
        axios.get(`/api/brand-booking`, {
          params: props?.params,
        }),
      ),
  });

export const useBrandBookingDetailedByIdReq = (
  id: string,
  type: BrandBookingType,
) =>
  useQuery<AnyBrandBooking, string>({
    queryKey: [BrandBookingQueryKey.detailedById, id],
    queryFn: () =>
      requestWithStringError(axios.get(`/api/brand-booking/${type}/${id}`)),
  });

export const useBrandBookingSlotsByServiceReq = (
  serviceId: string,
  props: {
    params: ServiceBrandBookingSlotsParams;
  },
) =>
  useQuery<BrandBookingSlot[], string>({
    ...props,
    enabled: !!serviceId,
    queryKey: [BrandBookingQueryKey.slotsByService, serviceId, props.params],
    queryFn: () =>
      requestWithStringError(
        axios.get(`/api/brand-booking/service/${serviceId}/slots`, {
          params: props.params,
        }),
      ),
  });

function useCreateBrandBookingReq<UT>(type: BrandBookingType) {
  return useMutation<AnyBrandBooking[], string, UT>({
    mutationFn: async (data) => {
      const bookings = await requestWithAlertOnError<AnyBrandBooking[]>(
        axios.post(`/api/brand-booking/${type}`, data),
      );

      void refetchQueriesByBookingChanges(
        bookings.map((booking) => ({
          id: booking.id,
          data: booking,
        })),
      );

      return bookings;
    },
  });
}

export const useCreateUnavailableBrandBookingReq = () =>
  useCreateBrandBookingReq<CreateUnavailableBrandBooking>(
    BrandBookingType.unavailable,
  );

export const useCreateServiceBrandBookingReq = () =>
  useCreateBrandBookingReq<CreateServiceBrandBooking>(BrandBookingType.service);

const useCancelBrandBookingReq = (type: BrandBookingType) =>
  useMutation<AnyBrandBooking[], string, { id: string; recurring: boolean }>({
    mutationFn: async ({ id, recurring }) => {
      const bookings = await requestWithAlertOnError<AnyBrandBooking[]>(
        axios.post(`/api/brand-booking/${type}/${id}/cancel`, {
          recurring,
        }),
      );

      void refetchQueriesByBookingChanges(
        bookings.map((booking) => ({
          id: booking.id,
          data: booking,
        })),
        false,
      );

      return bookings;
    },
  });

export const useCancelUnavailableBrandBookingReq = () =>
  useCancelBrandBookingReq(BrandBookingType.unavailable);

export const useCancelServiceBrandBookingReq = () =>
  useCancelBrandBookingReq(BrandBookingType.service);

export const useAddServiceBrandBookingClientReq = () =>
  useMutation<
    ServiceBrandBooking,
    string,
    { bookingId: string; data: CreateServiceBrandBookingClient }
  >({
    mutationFn: async ({ bookingId, data }) => {
      const booking = await requestWithAlertOnError<ServiceBrandBooking>(
        axios.post(
          `/api/brand-booking/${BrandBookingType.service}/${bookingId}/client`,
          data,
        ),
      );

      void refetchQueriesByBookingChanges(
        [
          {
            id: booking.id,
            data: booking,
          },
        ],
        false,
      );

      return booking;
    },
  });

function useUpdateBrandBookingQueryReq<UT>(type: BrandBookingType) {
  return useMutation<
    AnyBrandBooking[],
    string,
    {
      id: string;
      data: UT;
    }
  >({
    mutationFn: async ({ id, data }) => {
      const bookings = await requestWithAlertOnError<AnyBrandBooking[]>(
        axios.put(`/api/brand-booking/${type}/${id}`, data),
      );

      void refetchQueriesByBookingChanges(
        bookings.map((booking) => ({
          id: booking.id,
          data: booking,
        })),
        false,
      );

      return bookings;
    },
  });
}

export const useUpdateUnavailableBrandBookingReq = () =>
  useUpdateBrandBookingQueryReq<UpdateBrandBooking>(
    BrandBookingType.unavailable,
  );

export const useUpdateServiceBrandBookingReq = () =>
  useUpdateBrandBookingQueryReq<UpdateServiceBrandBooking>(
    BrandBookingType.service,
  );

export const useUpdateServiceBrandBookingClientReq = () =>
  useMutation<
    ServiceBrandBooking,
    string,
    {
      bookingId: string;
      clientId: string;
      data: UpdateServiceBrandBookingClient;
    }
  >({
    mutationFn: async ({ bookingId, clientId, data }) => {
      const booking = await requestWithAlertOnError<ServiceBrandBooking>(
        axios.put(
          `/api/brand-booking/${BrandBookingType.service}/${bookingId}/client/${clientId}`,
          data,
        ),
      );

      queryClient.setQueryData(
        [BrandBookingQueryKey.detailedById, bookingId],
        booking,
      );

      return booking;
    },
  });

export const useRemoveServiceBrandBookingClientReq = () =>
  useMutation<
    ServiceBrandBooking,
    string,
    {
      bookingId: string;
      clientId: string;
    }
  >({
    mutationFn: async ({ bookingId, clientId }) => {
      const booking = await requestWithAlertOnError<ServiceBrandBooking>(
        axios.delete(
          `/api/brand-booking/${BrandBookingType.service}/${bookingId}/client/${clientId}`,
        ),
      );
      void refetchQueriesByBookingChanges(
        [
          {
            id: booking.id,
            data: booking,
          },
        ],
        false,
      );

      return booking;
    },
  });
