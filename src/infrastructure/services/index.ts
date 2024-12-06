import fp from "fastify-plugin";
import { IBookingRepository } from "../../application/booking/bookingRepository.ts";
import { ICoachRepository } from "../../application/coach/coachRepository.ts";
import { CoachService } from "../../application/coach/coachService.ts";
import { BookingService } from "../../application/index.js";
import { ITimetableRepository } from "../../application/timetable/timetableRepository.ts";
import { TimetableService } from "../../application/timetable/timetableService.ts";
import { BookingDao } from "../dao/bookingDao.ts";
import { CoachDao } from "../dao/coachDao.ts";
import { TimetableDao } from "../dao/timetableDao.ts";

declare module "fastify" {
  interface FastifyInstance {
    bookingsService: BookingService;
    coachsService: CoachService;
    timetablesService: TimetableService;
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
});
