export type CreateBooking = {
  fullname: string | null;
  mail: string;
  day: string;
  timetableId: number;
};

export type Booking = {
  id: number;
  startHour: string;
  endHour: string;
  createdAt: Date;
  updatedAt: Date;
} & CreateBooking;

export type FilterBooking = Omit<Partial<CreateBooking>, "fullname"> & {
  dateFrom?: string;
  dateTo?: string;
};
