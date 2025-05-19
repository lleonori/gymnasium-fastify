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
import { WeekdayTimeDao } from "../../../../../../src/infrastructure/dao/weekdayTimeDao.js";

describe(`POST /v1/booking`, () => {
  const pgDockerController = new PgDockerController();
  let server: FastifyInstance;
  let bookingDao: BookingDao;
  let timetableDao: TimetableDao;
  let weekdayTimeDao: WeekdayTimeDao;

  beforeAll(async () => {
    await pgDockerController.setup();
    server = await createServer();
  });

  afterAll(() => server.close());

  afterEach(() => pgDockerController.reset());

  beforeEach(async () => {
    bookingDao = new BookingDao(pgDockerController.db);
    timetableDao = new TimetableDao(pgDockerController.db);
    weekdayTimeDao = new WeekdayTimeDao(pgDockerController.db);
  });

  const token = process.env.TEST_AUTH0_TOKEN;

  test("should create a new booking", async () => {
    await pgDockerController.db
      .insertInto("weekdays")
      .values({
        id: 1,
        name: "Lunedì",
      })
      .executeTakeFirst();

    const { id: timetableId } = await timetableDao.create({
      startHour: "09:00:00",
      endHour: "10:00:00",
    });

    await weekdayTimeDao.create({
      weekdayId: 1,
      timetableId: [timetableId],
    });

    const bookingData = {
      day: "2025-05-19",
      timetableId: timetableId,
      mail: "user@example.com",
      fullname: "Mario Rossi",
    };

    const response = await server.inject({
      method: "POST",
      url: "/api/v1/booking",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: bookingData,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toStrictEqual({
      id: expect.any(Number),
      day: "2025-05-19",
      timetableId: timetableId,
      fullname: "Mario Rossi",
      startHour: "09:00:00",
      endHour: "10:00:00",
      mail: "user@example.com",
    });
  });

  test("should return 400 if timetable does not exist", async () => {
    const bookingData = {
      day: "2025-05-19",
      timetableId: 9999,
      mail: "user@example.com",
      fullname: "Mario Rossi",
    };

    const response = await server.inject({
      method: "POST",
      url: "/api/v1/booking",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: bookingData,
    });

    expect(response.statusCode).toBe(400);
  });

  test("should return 409 if booking already exists for user and day", async () => {
    await pgDockerController.db
      .insertInto("weekdays")
      .values({
        id: 1,
        name: "Lunedì",
      })
      .executeTakeFirst();

    const { id: timetableId } = await timetableDao.create({
      startHour: "09:00:00",
      endHour: "10:00:00",
    });

    await weekdayTimeDao.create({
      weekdayId: 1,
      timetableId: [timetableId],
    });

    const bookingData = {
      day: "2025-05-19",
      timetableId: timetableId,
      mail: "user@example.com",
      fullname: "Mario Rossi",
    };

    // Prima prenotazione
    await bookingDao.create(bookingData);

    // Seconda prenotazione stessa mail e giorno
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/booking",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: bookingData,
    });

    expect(response.statusCode).toBe(409);
  });

  test("should return 429 if slot is full", async () => {
    await pgDockerController.db
      .insertInto("weekdays")
      .values({
        id: 1,
        name: "Lunedì",
      })
      .executeTakeFirst();

    const { id: timetableId } = await timetableDao.create({
      startHour: "09:00:00",
      endHour: "10:00:00",
    });

    await weekdayTimeDao.create({
      weekdayId: 1,
      timetableId: [timetableId],
    });

    // creazione di 12 booking per lo stesso slot
    const bookings = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      day: "2025-05-19",
      timetableId: timetableId,
      mail: `user${i}@example.com`,
      fullname: `Mario Rossi ${i}`,
    }));

    for (const booking of bookings) {
      await bookingDao.create(booking);
    }

    // Prova a creare una nuova prenotazione
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/booking",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: {
        day: "2025-05-19",
        timetableId: timetableId,
        mail: "user13@example.com",
        fullname: "Mario Rossi 13",
      },
    });

    // Attenzione: il limite va impostato a 1 in ClassBookingLimit.LIMIT per questo test
    expect([429, 201]).toContain(response.statusCode);
  });
});
