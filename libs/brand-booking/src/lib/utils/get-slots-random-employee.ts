import { BrandBookingSlot } from '@symbiot-core-apps/api';

export const getSlotsRandomEmployee = ({
  slots,
  start,
  locationId,
}: {
  slots: BrandBookingSlot[];
  start: number;
  locationId?: string;
}) => {
  return slots
    .reduce((employeeIds, { slots, location }) => {
      if (locationId === location?.id) {
        employeeIds.push(
          ...Object.keys(slots).filter((id) => slots[id].includes(start)),
        );
      }

      return employeeIds;
    }, [] as string[])
    .reduce((chosen, current, _, arr) =>
      Math.random() < 1 / (arr.indexOf(current) + 1) ? current : chosen,
    );
};
