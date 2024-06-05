export type CreateBooking = {
  mail: string;
  day: string;
  hour: string;
};

export type UpdateBooking = Partial<CreateBooking>;

export type Booking = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
} & CreateBooking;
