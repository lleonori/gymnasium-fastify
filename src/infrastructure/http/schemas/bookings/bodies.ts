import { Type } from "@sinclair/typebox";
import CommonSchemas from "../commons/index.ts";

export const CreateBooking = Type.Object({
  mail: Type.String(),
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
