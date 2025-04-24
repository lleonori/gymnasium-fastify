import fp from "fastify-plugin";
import { IBookingRepository } from "../../application/booking/bookingRepository.js";
import { ICoachRepository } from "../../application/coach/coachRepository.js";
import { CoachService } from "../../application/coach/coachService.js";
import { ITimetableRepository } from "../../application/timetable/timetableRepository.js";
import { TimetableService } from "../../application/timetable/timetableService.js";
import { BookingDao } from "../dao/bookingDao.js";
import { CoachDao } from "../dao/coachDao.js";
import { TimetableDao } from "../dao/timetableDao.js";
import { BookingService } from "../../application/booking/index.js";
import {
  IWeekdaysRepository,
  WeekdaysService,
} from "../../application/weekdays/index.js";
import { WeekdaysDao } from "../dao/weekdaysDao.js";

declare module "fastify" {
  interface FastifyInstance {
    bookingsService: BookingService;
    coachsService: CoachService;
    timetablesService: TimetableService;
    weekdaysService: WeekdaysService;
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
    fastify.db,
  );
  const timetablesService = new TimetableService(timetablesRepository);
  fastify.decorate("timetablesService", timetablesService);

  const weekdaysRepository: IWeekdaysRepository = new WeekdaysDao(fastify.db);
  const weekdaysService = new WeekdaysService(weekdaysRepository);
  fastify.decorate("weekdaysService", weekdaysService);
});
