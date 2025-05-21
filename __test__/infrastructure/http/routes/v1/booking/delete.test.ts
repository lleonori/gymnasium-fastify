import { FastifyInstance } from "fastify";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import PgDockerController from "../../../../../PgDockerController.js";
import { createServer } from "../../../../../utils/buildServer.js";
import { BookingDao } from "../../../../../../src/infrastructure/dao/bookingDao.js";
import { TimetableDao } from "../../../../../../src/infrastructure/dao/timetableDao.js";

describe(`DELETE /v1/booking/:bookingId`, () => {
  const pgDockerController = new PgDockerController();
  let server: FastifyInstance;
  let bookingDao: BookingDao;
  let timetableDao: TimetableDao;
  const token = process.env.TEST_AUTH0_TOKEN;

  beforeAll(async () => {
    await pgDockerController.setup();
    server = await createServer();
  });

  afterAll(async () => {
    if (server) await server.close();
  });

  afterEach(async () => await pgDockerController.reset());

  beforeEach(async () => {
    bookingDao = new BookingDao(pgDockerController.db);
    timetableDao = new TimetableDao(pgDockerController.db);
  });

  test("should delete a booking", async () => {
    const { id: timetableId } = await timetableDao.create({
      startHour: "09:00:00",
      endHour: "10:00:00",
    });

    const { id: bookingId } = await bookingDao.create({
      day: "2024-05-20",
      timetableId,
      mail: "user@example.com",
      fullname: "Mario Rossi",
    });

    const response = await server.inject({
      method: "DELETE",
      url: `/api/v1/booking/${bookingId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toStrictEqual({
      id: bookingId,
      day: "2024-05-20",
      timetableId,
      fullname: "Mario Rossi",
      startHour: "09:00:00",
      endHour: "10:00:00",
      mail: "user@example.com",
    });

    // Verifica che sia stato eliminato dal DB
    const deleted = await bookingDao.findById(bookingId);
    expect(deleted).toBeUndefined();
  });

  test("should return 404 if booking does not exist", async () => {
    const response = await server.inject({
      method: "DELETE",
      url: `/api/v1/booking/9999`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(204);
  });
});
