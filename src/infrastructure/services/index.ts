import fp from "fastify-plugin";
import { BookingService } from "../../application/index.js";
import { IBookingRepository } from "../../application/booking/bookingRepository.ts";
import { BookingDao } from "../dao/bookingDao.ts";

declare module "fastify" {
  interface FastifyInstance {
    bookingsService: BookingService;
  }
}

export default fp(async (fastify) => {
  const bookingsRepository: IBookingRepository = new BookingDao(fastify.db);
  const bookingsService = new BookingService(bookingsRepository);
  fastify.decorate("bookingsService", bookingsService);
});
