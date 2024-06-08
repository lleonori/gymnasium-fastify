import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { BookingSchemas } from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.patch(
    "/:bookingMail",
    {
      schema: {
        tags: ["Booking"],
        params: BookingSchemas.Params.BookingMail,
        body: BookingSchemas.Bodies.UpdateBooking,
        response: {
          200: BookingSchemas.Bodies.Booking,
        },
      },
    },
    async (request) =>
      app.bookingsService.update(request.params.bookingMail, request.body)
  );
};

export default routes;
