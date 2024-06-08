import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { BookingSchemas } from "../../../schemas/index.ts";

const routes: FastifyPluginAsyncTypebox = async (app) => {
  app.delete(
    "/:bookingMail",
    {
      schema: {
        tags: ["Booking"],
        params: BookingSchemas.Params.BookingMail,
        response: {
          200: BookingSchemas.Bodies.Booking,
        },
      },
    },
    ({ params: { bookingMail } }) => app.bookingsService.delete(bookingMail)
  );
};

export default routes;
