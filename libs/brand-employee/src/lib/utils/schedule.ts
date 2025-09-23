export const defaultEmployeeSchedule = [
  ...Array.from({ length: 5 }).map((_, index) => ({
    day: index + 1,
    start: 540,
    end: 1080,
  })),
  {
    day: 0,
    start: 0,
    end: 0,
  },
  {
    day: 6,
    start: 0,
    end: 0,
  },
];
