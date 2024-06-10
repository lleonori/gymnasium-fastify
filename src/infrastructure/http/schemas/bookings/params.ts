import { Type } from "@sinclair/typebox";

export const BookingMail = Type.Object({
  bookingMail: Type.String(),
});

export const BookingId = Type.Object({
  bookingId: Type.Number(),
});
