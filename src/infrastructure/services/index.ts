import fp from "fastify-plugin";
import {
  BookingService,
  IBookingRepository,
} from "../../application/booking/index.js";
import {
  CoachService,
  ICoachRepository,
} from "../../application/coach/index.js";
import { TimetableService } from "../../application/timetable/index.js";
import { ITimetableRepository } from "../../application/timetable/timetableRepository.js";
import {
  IWeekdayTimeRepository,
  WeekdayTimeService,
} from "../../application/weekday-time/index.js";
import {
  IWeekdayRepository,
  WeekdayService,
} from "../../application/weekday/index.js";
import { BookingDao } from "../dao/bookingDao.js";
import { CoachDao } from "../dao/coachDao.js";
import { TimetableDao } from "../dao/timetableDao.js";
import { WeekdayDao } from "../dao/weekdayDao.js";
import { WeekdayTimeDao } from "../dao/weekdayTimeDao.js";
import { TimetableBookingManagerService } from "../../application/timetable-booking-manager/index.js";

declare module "fastify" {
  interface FastifyInstance {
    bookingsService: BookingService;
    coachesService: CoachService;
    timetablesService: TimetableService;
    weekdayService: WeekdayService;
    weekdayTimeService: WeekdayTimeService;
    timetableBookingManagerService: TimetableBookingManagerService;
  }
}

export default fp(async (fastify) => {
  const bookingsRepository: IBookingRepository = new BookingDao(fastify.db);
  const bookingsService = new BookingService(bookingsRepository);
  fastify.decorate("bookingsService", bookingsService);

  const coachesRepository: ICoachRepository = new CoachDao(fastify.db);
  const coachesService = new CoachService(coachesRepository);
  fastify.decorate("coachesService", coachesService);

  const timetablesRepository: ITimetableRepository = new TimetableDao(
    fastify.db,
  );
  const timetablesService = new TimetableService(timetablesRepository);
  fastify.decorate("timetablesService", timetablesService);

  const weekdaysRepository: IWeekdayRepository = new WeekdayDao(fastify.db);
  const weekdayService = new WeekdayService(weekdaysRepository);
  fastify.decorate("weekdayService", weekdayService);

  const weekdaysTimesRepository: IWeekdayTimeRepository = new WeekdayTimeDao(
    fastify.db,
  );
  const weekdayTimeService = new WeekdayTimeService(weekdaysTimesRepository);
  fastify.decorate("weekdayTimeService", weekdayTimeService);

  const timetableBookingManagerService = new TimetableBookingManagerService(
    fastify.timetablesService,
    fastify.bookingsService,
    timetablesRepository,
    bookingsRepository,
  );
  fastify.decorate(
    "timetableBookingManagerService",
    timetableBookingManagerService,
  );
});
