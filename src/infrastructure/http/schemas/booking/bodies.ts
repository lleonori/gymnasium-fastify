import { Type } from "@sinclair/typebox";
import CommonSchemas from "../commons/index.js";

export const CreateBooking = Type.Object({
  fullname: Type.Union([Type.String(), Type.Null()]),
  mail: Type.String({ format: "email" }),
  day: Type.String({ format: "date" }),
  timetableId: Type.Number(),
});

export const UpdateBooking = Type.Partial(CreateBooking);

export const Booking = Type.Intersect([
  Type.Object({
    id: Type.Number(),
    startHour: Type.String({ format: "time" }),
    endHour: Type.String({ format: "time" }),
  }),
  CreateBooking,
]);

export const BookingsPaginated = CommonSchemas.Bodies.PaginationResult(Booking);
