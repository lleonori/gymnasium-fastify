export type CreateBooking = {
  name: string;
  surname: string;
  booking_at: string;
};

export type UpdateBooking = Partial<CreateBooking>;

export type Booking = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
} & CreateBooking;
