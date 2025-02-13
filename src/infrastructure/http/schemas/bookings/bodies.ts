import { Type } from "@sinclair/typebox";
import CommonSchemas from "../commons/index.js";

export const CreateBooking = Type.Object({
  fullname: Type.Union([Type.String(), Type.Null()]),
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
