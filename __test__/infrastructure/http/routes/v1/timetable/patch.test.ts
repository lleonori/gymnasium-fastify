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

describe(`PATCH /v1/timetable/:timetableId`, () => {
  let server: FastifyInstance;
  let timetableDao: TimetableDao;
  let timetableId: number;
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

    const timetable = await timetableDao.create({
      startHour: "08:00:00Z",
      endHour: "09:00:00Z",
    });
    timetableId = timetable.id;
  });

  test("should update a timetable", async () => {
    const response = await server.inject({
      method: "PATCH",
      url: `/api/v1/timetable/${timetableId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: {
        startHour: "10:00:00Z",
        endHour: "11:00:00Z",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toStrictEqual({
      id: timetableId,
      startHour: "10:00:00",
      endHour: "11:00:00",
    });

    const updated = await timetableDao.findById(timetableId);
    expect(updated).toStrictEqual({
      id: timetableId,
      startHour: "10:00:00",
      endHour: "11:00:00",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  test("should return 404 if timetable does not exist", async () => {
    const response = await server.inject({
      method: "PATCH",
      url: `/api/v1/timetable/9999`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: {
        startHour: "12:00:00Z",
        endHour: "13:00:00Z",
      },
    });

    expect(response.statusCode).toBe(404);
  });
});
