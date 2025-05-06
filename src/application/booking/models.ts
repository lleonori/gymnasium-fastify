export type CreateBooking = {
  fullname: string | null;
  mail: string;
  day: string;
  hour: string;
};

export type Booking = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
} & CreateBooking;

export type FilterBooking = Partial<CreateBooking> & {
  dateFrom?: string;
  dateTo?: string;
};
