import fp from "fastify-plugin";
import { BookingService } from "../../application/index.js";
import { IBookingRepository } from "../../application/booking/bookingRepository.ts";
import { BookingDao } from "../dao/bookingDao.ts";
import { ICoachRepository } from "../../application/coach/coachRepository.ts";
import { CoachDao } from "../dao/coachDao.ts";
import { CoachService } from "../../application/coach/coachService.ts";
import { ITimetableRepository } from "../../application/timetable/timetableRepository.ts";
import { TimetableDao } from "../dao/timetableDao.ts";
import { TimetableService } from "../../application/timetable/timetableService.ts";
import { ICalendarRepository } from "../../application/calendar/calendarRepository.ts";
import { CalendarDao } from "../dao/calendarDao.ts";
import { CalendarService } from "../../application/calendar/calendarService.ts";

declare module "fastify" {
  interface FastifyInstance {
    bookingsService: BookingService;
    coachsService: CoachService;
    timetablesService: TimetableService;
    calendarsService: CalendarService;
  }
}

export default fp(async (fastify) => {
  const bookingsRepository: IBookingRepository = new BookingDao(fastify.db);
  const bookingsService = new BookingService(bookingsRepository);
  fastify.decorate("bookingsService", bookingsService);

  const coachsRepository: ICoachRepository = new CoachDao(fastify.db);
  const coachsService = new CoachService(coachsRepository);
  fastify.decorate("coachsService", coachsService);

  const timetablesRepository: ITimetableRepository = new TimetableDao(
    fastify.db
  );
  const timetablesService = new TimetableService(timetablesRepository);
  fastify.decorate("timetablesService", timetablesService);

  const calendarsRepository: ICalendarRepository = new CalendarDao(fastify.db);
  const calendarsService = new CalendarService(calendarsRepository);
  fastify.decorate("calendarsService", calendarsService);
});