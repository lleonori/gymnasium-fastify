import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { BookingSchemas } from "../../../schemas/index.js";
import { ClassBookingLimit, UserRoles } from "../../../utils/enums.js";
import {
  BadRequestException,
  ConflictException,
  TooManyRequestsException,
} from "../../../../../application/commons/exceptions.js";
import { validateBookingRequest } from "../../../../validations/booking.validation.js";
import { hasRole } from "../../../../auth/hasRole.js";
import { isAuthenticated } from "../../../../auth/isAuthenticated.js";
import { formatTime } from "../../../utils/datetime.js";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/",
    {
      schema: {
        tags: ["Booking"],
        body: BookingSchemas.Bodies.CreateBooking,
        response: {
          201: BookingSchemas.Bodies.Booking,
        },
      },
      preHandler: app.auth(
        [
          isAuthenticated,
          hasRole([
            UserRoles.SYSTEM_ADMINISTRATOR,
            UserRoles.ADMINISTRATOR,
            UserRoles.USER,
          ]),
        ],
        { relation: "and" },
      ),
    },
    async (request, reply) => {
      validateBookingRequest(app, request.body);

      const timetables = await app.timetablesService.findAll(
        { weekdayId: new Date(request.body.day).getDay() },
        { offset: 0, limit: 10 },
        [["hour", "asc"]],
      );

      const isValidHour = timetables.data.some(
        (timetable) => timetable.hour === formatTime(request.body.hour),
      );

      // daily booking limit for user
      const countBookingsForDayAndEmail =
        await app.bookingsService.countBookingsForDayAndEmail(
          new Date(request.body.day),
          request.body.mail,
        );

      // determines the maximum number of reservations in a time slot
      const countBookingsForDay =
        await app.bookingsService.countBookingsForDayAndHour(
          new Date(request.body.day),
          request.body.hour,
        );

      if (
        countBookingsForDayAndEmail === 0 &&
        countBookingsForDay <= ClassBookingLimit.LIMIT &&
        isValidHour
      ) {
        const newBooking = await app.bookingsService.create(request.body);
        return reply.status(201).send(newBooking);
      } else {
        if (countBookingsForDayAndEmail > 0)
          throw new ConflictException("La lezione è stata già prenotata.");
        else if (countBookingsForDay >= ClassBookingLimit.LIMIT)
          throw new TooManyRequestsException(
            "Limite di prenotazione raggiunto.",
          );
        else if (isValidHour)
          throw new BadRequestException("Orario non valido.");
      }
    },
  );
};

export default routes;
