import { Type } from "@sinclair/typebox";
import CommonSchemas from "../commons/index.ts";

export const CreateBooking = Type.Object({
  fullName: Type.Union([Type.String(), Type.Null()]),
  mail: Type.String({ format: "email" }),
  day: Type.String({ format: "date-time" }), // ISO 8601 date format
  hour: Type.String(),
});

export const UpdateBooking = Type.Partial(CreateBooking);

export const Booking = Type.Intersect([
  Type.Object({
    id: Type.Number(),
  }),
  CreateBooking,
]);

export const BookingsPaginated = CommonSchemas.Bodies.PaginationResult(Booking);
