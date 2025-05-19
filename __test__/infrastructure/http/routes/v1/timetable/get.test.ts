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
import { TimetableDao } from "../../../../../../src/infrastructure/dao/timetableDao.js";
import PgDockerController from "../../../../../PgDockerController.js";
import { createServer } from "../../../../../utils/buildServer.js";

describe(`GET /v1/timetable`, () => {
  let server: FastifyInstance;
  let timetableDao: TimetableDao;
  const pgDockerController = new PgDockerController();
  const token = process.env.TEST_AUTH0_TOKEN;

  beforeAll(async () => {
    await pgDockerController.setup();
    server = await createServer();
  });

  afterAll(() => server.close());

  afterEach(() => pgDockerController.reset());

  beforeEach(async () => {
    timetableDao = new TimetableDao(pgDockerController.db);

    // Popola la tabella timetables con 10 record
    for (let i = 0; i < 10; i++) {
      await timetableDao.create({
        startHour: `0${i}:00:00Z`,
        endHour: `1${i}:00:00Z`,
      });
    }
  });

  test("should return all timetables", async () => {
    const expectedResult = {
      count: 10,
      data: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        startHour: `0${i}:00:00`,
        endHour: `1${i}:00:00`,
      })),
    };

    const response = await server.inject({
      method: "GET",
      url: "/api/v1/timetable",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toStrictEqual(expectedResult);
  });

  test("should return paginated list", async () => {
    const expectedResult = {
      count: 10,
      data: Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        startHour: `0${i}:00:00`,
        endHour: `1${i}:00:00`,
      })),
    };

    const response = await server.inject({
      method: "GET",
      url: `/api/v1/timetable?limit=5&offset=0`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toStrictEqual(expectedResult);
  });

  test("should return sorted list", async () => {
    const expectedResult = {
      count: 10,
      data: Array.from({ length: 10 }, (_, i) => ({
        id: 10 - i,
        startHour: `0${9 - i}:00:00`,
        endHour: `1${9 - i}:00:00`,
      })),
    };

    const response = await server.inject({
      method: "GET",
      url: `/api/v1/timetable?sort=id.desc`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toStrictEqual(expectedResult);
  });
});
