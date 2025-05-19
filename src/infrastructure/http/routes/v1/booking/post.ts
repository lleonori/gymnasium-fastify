import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  TooManyRequestsException,
} from "../../../../../application/commons/exceptions.js";
import { hasRole } from "../../../../auth/hasRole.js";
import { isAuthenticated } from "../../../../auth/isAuthenticated.js";
import { validateBookingRequest } from "../../../../validations/booking.validation.js";
import { BookingSchemas } from "../../../schemas/index.js";
import {
  BookingLimitHours,
  ClassBookingLimit,
  UserRoles,
} from "../../../utils/enums.js";
import { formatTimeInSecond, getTime } from "../../../utils/datetime.js";

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

      const timetable = await ensureTimetableExists(
        request.body.day,
        request.body.timetableId,
      );

      enforceTimeLimit(timetable.startHour, request.body.day);

      await enforceDailyBookingLimit(request.body.day, request.body.mail);

      await enforceSlotCapacity(request.body.day, request.body.timetableId);

      const newBooking = await app.bookingsService.create(request.body);
      return reply.status(201).send(newBooking);
    },
  );

  async function ensureTimetableExists(day: string, timetableId: number) {
    const weekday = new Date(day).getDay();
    const timetables = await app.timetablesService.findAll(
      { weekdayId: weekday },
      { offset: 0, limit: 10 },
      [["startHour", "asc"]],
    );

    const exists = timetables.data.some((t) => t.id === timetableId);
    if (!exists) {
      throw new BadRequestException("Orario non valido.");
    }

    return await app.timetablesService.findById(timetableId);
  }

  function enforceTimeLimit(timetableStart: string, bookingDay: string) {
    const current = getTime();
    const now = new Date();
    const today = now;

    if (today.toDateString() === new Date(bookingDay).toDateString()) {
      const secondsUntilStart =
        formatTimeInSecond(timetableStart) - formatTimeInSecond(current);
      if (secondsUntilStart < BookingLimitHours.LIMIT) {
        throw new ForbiddenException(
          "Impossibile prenotare: il tempo limite è scaduto.",
        );
      }
    }
  }

  async function enforceDailyBookingLimit(day: string, mail: string) {
    const count = await app.bookingsService.countBookingsForDayAndEmail(
      new Date(day),
      mail,
    );
    if (count > 0) {
      throw new ConflictException("La lezione è stata già prenotata.");
    }
  }

  async function enforceSlotCapacity(day: string, timetableId: number) {
    const count = await app.bookingsService.countBookingsForDayAndTimetableId(
      new Date(day),
      timetableId,
    );
    if (count >= ClassBookingLimit.LIMIT) {
      throw new TooManyRequestsException("Limite di prenotazione raggiunto.");
    }
  }
};

export default routes;
