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

describe(`GET /v1/booking`, () => {
  const pgDockerController = new PgDockerController();
  let server: FastifyInstance;
  let bookingDao: BookingDao;

  beforeAll(async () => {
    await pgDockerController.setup();
    server = await createServer();
    bookingDao = new BookingDao(pgDockerController.db);
  });

  afterAll(() => server.close());

  afterEach(() => pgDockerController.reset());

  beforeEach(async () => {
    // Popola la tabella bookings con 10 prenotazioni
    for (let i = 0; i < 10; i++) {
      await bookingDao.create({
        day: `2024-05-${String(i + 10).padStart(2, "0")}`,
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
        day: `2024-05-${String(i + 10).padStart(2, "0")}`,
        timetableId: 1,
        mail: `user${i}@test.com`,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
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
    expect(response.json()).toMatchObject(expectedResult);
  });

  test("should return paginated bookings", async () => {
    const expectedResult = {
      count: 10,
      data: Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        day: `2024-05-${String(i + 10).padStart(2, "0")}`,
        timetableId: 1,
        mail: `user${i}@test.com`,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
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
    expect(response.json()).toMatchObject(expectedResult);
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
      url: "/api/v1/booking?day=2024-05-12",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toHaveLength(1);
    expect(response.json().data[0].day).toBe("2024-05-12");
  });

  test("should return 401 if not authenticated", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/api/v1/booking",
    });

    expect(response.statusCode).toBe(401);
  });
});
