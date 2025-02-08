import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { BookingSchemas } from "../../../schemas/index.js";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.delete(
    "/:bookingId",
    {
      schema: {
        tags: ["Booking"],
        params: BookingSchemas.Params.BookingId,
        response: {
          200: BookingSchemas.Bodies.Booking,
        },
      },
    },
    async ({ params: { bookingId } }) => app.bookingsService.delete(bookingId),
  );
};

export default routes;
