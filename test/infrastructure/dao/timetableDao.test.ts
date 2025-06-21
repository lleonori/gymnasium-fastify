import { reverse } from "rambda";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import { TimetableDao } from "../../../src/infrastructure/dao/timetableDao.js";
import PgDockerController from "../../PgDockerController.js";

describe("TimetableDao", () => {
  const pgDockerController = new PgDockerController();
  let timetableDao: TimetableDao;

  beforeAll(async () => await pgDockerController.setup());

  beforeEach(() => {
    timetableDao = new TimetableDao(pgDockerController.db);
  });

  afterEach(async () => await pgDockerController.reset());

  // afterAll(async () => {
  //   await pgDockerController.tearDown();
  // });

  describe("create", () => {
    test("should create a timetable", async () => {
      const timetableData = {
        startHour: "08:00:00Z",
        endHour: "09:00:00Z",
      };

      const timetable = await timetableDao.create(timetableData);

      expect(timetable).toEqual({
        id: expect.any(Number),
        startHour: "08:00:00",
        endHour: "09:00:00",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe("findAll", () => {
    beforeEach(async () => {
      for (let i = 0; i < 10; i++) {
        await timetableDao.create({
          startHour: `0${i}:00`,
          endHour: `1${i}:00`,
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
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })),
      };

      const timetables = await timetableDao.findAll(
        {},
        { limit: 10, offset: 0 },
        [["id", "asc"]],
      );

      expect(timetables).toStrictEqual(expectedResult);
    });

    test("should return paginated timetables", async () => {
      const expectedResult = {
        count: 10,
        data: Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          startHour: `0${i}:00:00`,
          endHour: `1${i}:00:00`,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })),
      };

      const timetables = await timetableDao.findAll(
        {},
        { limit: 5, offset: 0 },
        [["id", "asc"]],
      );

      expect(timetables).toStrictEqual(expectedResult);
    });

    test("should return sorted timetables", async () => {
      const expectedResult = {
        count: 10,
        data: reverse(
          Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            startHour: `0${i}:00:00`,
            endHour: `1${i}:00:00`,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          })),
        ),
      };

      const timetables = await timetableDao.findAll(
        {},
        { limit: 10, offset: 0 },
        [["id", "desc"]],
      );

      expect(timetables).toStrictEqual(expectedResult);
    });
  });

  describe("findById", () => {
    let id: number;
    beforeEach(async () => {
      ({ id } = await timetableDao.create({
        startHour: "08:00",
        endHour: "09:00",
      }));
    });

    test("should return a timetable", async () => {
      const timetable = await timetableDao.findById(id);

      expect(timetable).toEqual({
        id: id,
        startHour: "08:00:00",
        endHour: "09:00:00",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    test("should return undefined if timetable is not found", async () => {
      const timetable = await timetableDao.findById(9999);

      expect(timetable).toBeUndefined();
    });
  });

  describe("update", () => {
    let id: number;
    beforeEach(async () => {
      ({ id } = await timetableDao.create({
        startHour: "08:00:00Z",
        endHour: "09:00:00Z",
      }));
    });

    test("should update a timetable", async () => {
      const updatedTimetable = await timetableDao.update(id, {
        startHour: "10:00:00Z",
        endHour: "11:00:00Z",
      });

      expect(updatedTimetable).toStrictEqual({
        id: id,
        startHour: "10:00:00",
        endHour: "11:00:00",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    test("should return undefined if timetable is not found", async () => {
      const timetable = await timetableDao.update(9999, {
        startHour: "10:00",
        endHour: "11:00",
      });

      expect(timetable).toBeUndefined();
    });
  });

  describe("delete", () => {
    let id: number;
    beforeEach(async () => {
      ({ id } = await timetableDao.create({
        startHour: "08:00",
        endHour: "09:00",
      }));
    });

    test("should delete a timetable", async () => {
      const timetable = await timetableDao.delete(id);

      expect(timetable).toStrictEqual({
        id: id,
        startHour: "08:00:00",
        endHour: "09:00:00",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      const deletedTimetable = await timetableDao.findById(id);
      expect(deletedTimetable).toBeUndefined();
    });

    test("should return undefined if timetable is not found", async () => {
      const timetable = await timetableDao.delete(9999);

      expect(timetable).toBeUndefined();
    });
  });
});
