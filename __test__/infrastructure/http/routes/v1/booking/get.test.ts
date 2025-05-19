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
import { getTodayAndTomorrow } from "../../../../../../src/infrastructure/http/utils/datetime.js";
import { TimetableDao } from "../../../../../../src/infrastructure/dao/timetableDao.js";
import { WeekdayTimeDao } from "../../../../../../src/infrastructure/dao/weekdayTimeDao.js";

describe(`GET /v1/booking`, () => {
  const pgDockerController = new PgDockerController();
  let server: FastifyInstance;
  let bookingDao: BookingDao;
  let timetableDao: TimetableDao;
  let weekdayTimeDao: WeekdayTimeDao;
  let tomorrowDate: string;
  let weekdayId: number;
  let weekdayName: string;

  beforeAll(async () => {
    await pgDockerController.setup();
    server = await createServer();
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

  afterAll(() => server.close());

  afterEach(() => pgDockerController.reset());

  beforeEach(async () => {
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

    // Popola la tabella bookings con 10 prenotazioni
    for (let i = 0; i < 10; i++) {
      await bookingDao.create({
        day: tomorrowDate,
        timetableId: 1,
        mail: `user${i}@test.com`,
        fullname: `User ${i}`,
      });
    }
  });

  const token = process.env.TEST_AUTH0_TOKEN;

  test("should return all bookings", async () => {
    const expectedResult = {
      count: 10,
      data: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        day: tomorrowDate,
        timetableId: 1,
        mail: `user${i}@test.com`,
        startHour: "09:00:00",
        endHour: "10:00:00",
        fullname: `User ${i}`,
      })),
    };

    const response = await server.inject({
      method: "GET",
      url: "/api/v1/booking",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toStrictEqual(expectedResult);
  });

  test("should return paginated bookings", async () => {
    const expectedResult = {
      count: 10,
      data: Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        day: tomorrowDate,
        timetableId: 1,
        mail: `user${i}@test.com`,
        startHour: "09:00:00",
        endHour: "10:00:00",
        fullname: `User ${i}`,
      })),
    };

    const response = await server.inject({
      method: "GET",
      url: "/api/v1/booking?limit=5&offset=0",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toStrictEqual(expectedResult);
  });

  test("should filter by mail", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/api/v1/booking?mail=user3@test.com",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toHaveLength(1);
    expect(response.json().data[0].mail).toBe("user3@test.com");
  });

  test("should filter by day", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/api/v1/booking?day=${tomorrowDate}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toHaveLength(10);
    expect(response.json().data[0].day).toBe(tomorrowDate);
  });

  test("should return 401 if not authenticated", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/api/v1/booking",
    });

    expect(response.statusCode).toBe(401);
  });
});
