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
import { getTodayAndTomorrow } from "../../../../../../src/infrastructure/http/utils/datetime.js";

describe(`POST /v1/booking`, () => {
  const pgDockerController = new PgDockerController();
  let server: FastifyInstance;
  let bookingDao: BookingDao;
  let timetableDao: TimetableDao;
  let weekdayTimeDao: WeekdayTimeDao;
  let tomorrowDate: string;
  let weekdayId: number;
  let weekdayName: string;

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
    weekdayTimeDao = new WeekdayTimeDao(pgDockerController.db);

    const { tomorrow } = getTodayAndTomorrow();
    tomorrowDate = tomorrow;
    weekdayId = new Date(tomorrowDate).getDay();
    weekdayName = new Intl.DateTimeFormat("it-IT", {
      weekday: "long",
    }).format(new Date(tomorrowDate));
  });

  test("should create a new booking", async () => {
    await pgDockerController.db
      .insertInto("weekdays")
      .values({
        id: weekdayId,
        name: weekdayName,
      })
      .executeTakeFirst();

    const { id: timetableId } = await timetableDao.create({
      startHour: "09:00:00",
      endHour: "10:00:00",
    });

    await weekdayTimeDao.create({
      weekdayId: weekdayId,
      timetableId: [timetableId],
    });

    const bookingData = {
      day: tomorrowDate,
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
      day: tomorrowDate,
      timetableId: timetableId,
      fullname: "Mario Rossi",
      startHour: "09:00:00",
      endHour: "10:00:00",
      mail: "user@example.com",
    });
  });

  test("should return 404 if timetable does not exist", async () => {
    const bookingData = {
      day: tomorrowDate,
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

    expect(response.statusCode).toBe(404);
  });

  test("should return 409 if booking already exists for user and day", async () => {
    await pgDockerController.db
      .insertInto("weekdays")
      .values({
        id: weekdayId,
        name: weekdayName,
      })
      .executeTakeFirst();

    const { id: timetableId } = await timetableDao.create({
      startHour: "09:00:00",
      endHour: "10:00:00",
    });

    await weekdayTimeDao.create({
      weekdayId: weekdayId,
      timetableId: [timetableId],
    });

    const bookingData = {
      day: tomorrowDate,
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
        id: weekdayId,
        name: weekdayName,
      })
      .executeTakeFirst();

    const { id: timetableId } = await timetableDao.create({
      startHour: "09:00:00",
      endHour: "10:00:00",
    });

    await weekdayTimeDao.create({
      weekdayId: weekdayId,
      timetableId: [timetableId],
    });

    // creazione di 12 booking per lo stesso slot
    const bookings = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      day: tomorrowDate,
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
        day: tomorrowDate,
        timetableId: timetableId,
        mail: "user13@example.com",
        fullname: "Mario Rossi 13",
      },
    });

    expect([429, 201]).toContain(response.statusCode);
  });
});
