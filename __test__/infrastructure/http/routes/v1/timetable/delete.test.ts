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

describe(`DELETE /v1/timetable/:timetableId`, () => {
  const pgDockerController = new PgDockerController();
  let server: FastifyInstance;
  let timetableDao: TimetableDao;
  let timetableId: number;

  beforeAll(async () => {
    await pgDockerController.setup();
    server = await createServer();
    timetableDao = new TimetableDao(pgDockerController.db);
  });

  afterAll(() => server.close());

  afterEach(() => pgDockerController.reset());

  beforeEach(async () => {
    const timetable = await timetableDao.create({
      startHour: "08:00:00Z",
      endHour: "09:00:00Z",
    });
    timetableId = timetable.id;
  });

  const token = process.env.TEST_AUTH0_TOKEN;

  test("should delete a timetable", async () => {
    const response = await server.inject({
      method: "DELETE",
      url: `/api/v1/timetable/${timetableId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toStrictEqual({
      id: timetableId,
      startHour: "08:00:00",
      endHour: "09:00:00",
    });

    // Verifica che sia stato eliminato dal DB
    const deleted = await timetableDao.findById(timetableId);
    expect(deleted).toBeUndefined();
  });

  test("should return 404 if timetable does not exist", async () => {
    const response = await server.inject({
      method: "DELETE",
      url: `/api/v1/timetable/9999`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(204);
  });
});
