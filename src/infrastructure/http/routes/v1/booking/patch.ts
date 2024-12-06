import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { BookingSchemas } from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.patch(
    "/:bookingId",
    {
      schema: {
        tags: ["Booking"],
        params: BookingSchemas.Params.BookingId,
        body: BookingSchemas.Bodies.UpdateBooking,
        response: {
          200: BookingSchemas.Bodies.Booking,
        },
      },
    },
    async (request) =>
      app.bookingsService.update(request.params.bookingId, request.body),
  );
};

export default routes;
