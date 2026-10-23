import { Type } from "typebox";

export const BookingMail = Type.Object({
  bookingMail: Type.String({ format: "email" }),
});

export const BookingId = Type.Object({
  bookingId: Type.Number(),
});
