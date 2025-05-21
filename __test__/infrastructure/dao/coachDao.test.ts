import { reverse } from "rambda";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import { CoachDao } from "../../../src/infrastructure/dao/coachDao.js";
import PgDockerController from "../../PgDockerController.js";

describe("CoachDao", () => {
  const pgDockerController = new PgDockerController();
  let coachDao: CoachDao;

  beforeAll(async () => await pgDockerController.setup());

  beforeEach(() => {
    coachDao = new CoachDao(pgDockerController.db);
  });

  afterEach(async () => await pgDockerController.reset());

  // afterAll(async () => {
  //   await pgDockerController.tearDown();
  // });

  describe("create", () => {
    test("should create a coach", async () => {
      const coachData = {
        name: "Mario",
        surname: "Rossi",
        notes: "Test",
      };

      const coach = await coachDao.create(coachData);

      expect(coach).toEqual({
        id: expect.any(Number),
        name: "Mario",
        surname: "Rossi",
        notes: "Test",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe("findAll", () => {
    beforeEach(async () => {
      for (let i = 0; i < 10; i++) {
        await coachDao.create({
          name: `CoachName${i}`,
          surname: `CoachSurname${i}`,
          notes: `Note${i}`,
        });
      }
    });

    test("should return all coachs", async () => {
      const expectedResult = {
        count: "10",
        data: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `CoachName${i}`,
          surname: `CoachSurname${i}`,
          notes: `Note${i}`,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })),
      };

      const coachs = await coachDao.findAll(
        {
          limit: 10,
          offset: 0,
        },
        [["id", "asc"]],
      );

      expect(coachs).toStrictEqual(expectedResult);
    });

    test("should return paginated coachs", async () => {
      const expectedResult = {
        count: "10",
        data: Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          name: `CoachName${i}`,
          surname: `CoachSurname${i}`,
          notes: `Note${i}`,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })),
      };

      const coachs = await coachDao.findAll(
        {
          limit: 5,
          offset: 0,
        },
        [["name", "asc"]],
      );

      expect(coachs).toStrictEqual(expectedResult);
    });

    test("should return sorted coachs", async () => {
      const expectedResult = {
        count: "10",
        data: reverse(
          Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            name: `CoachName${i}`,
            surname: `CoachSurname${i}`,
            notes: `Note${i}`,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          })),
        ),
      };

      const coachs = await coachDao.findAll(
        {
          limit: 10,
          offset: 0,
        },
        [["id", "desc"]],
      );

      expect(coachs).toStrictEqual(expectedResult);
    });
  });

  describe("findById", () => {
    let id: number;
    beforeEach(async () => {
      ({ id } = await coachDao.create({
        name: "Mario",
        surname: "Rossi",
        notes: "Test",
      }));
    });

    test("should return a coach", async () => {
      const coach = await coachDao.findById(id);

      expect(coach).toEqual({
        id: id,
        name: "Mario",
        surname: "Rossi",
        notes: "Test",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    test("should return undefined if coach is not found", async () => {
      const coach = await coachDao.findById(9999);

      expect(coach).toBeUndefined();
    });
  });

  describe("update", () => {
    let id: number;
    beforeEach(async () => {
      ({ id } = await coachDao.create({
        name: "Mario",
        surname: "Rossi",
        notes: "Test",
      }));
    });

    test("should update a coach", async () => {
      const updatedCoach = await coachDao.update(id, {
        name: "Luigi",
        surname: "Verdi",
        notes: "Aggiornato",
      });

      expect(updatedCoach).toEqual({
        id: id,
        name: "Luigi",
        surname: "Verdi",
        notes: "Aggiornato",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    test("should return undefined if coach is not found", async () => {
      const coach = await coachDao.update(9999, {
        name: "Luigi",
        surname: "Verdi",
        notes: "Aggiornato",
      });

      expect(coach).toBeUndefined();
    });
  });

  describe("delete", () => {
    let id: number;
    beforeEach(async () => {
      ({ id } = await coachDao.create({
        name: "Mario",
        surname: "Rossi",
        notes: "Test",
      }));
    });

    test("should delete a coach", async () => {
      const coach = await coachDao.delete(id);

      expect(coach).toEqual({
        id: id,
        name: "Mario",
        surname: "Rossi",
        notes: "Test",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      const deletedCoach = await coachDao.findById(id);
      expect(deletedCoach).toBeUndefined();
    });

    test("should return undefined if coach is not found", async () => {
      const coach = await coachDao.delete(9999);

      expect(coach).toBeUndefined();
    });
  });
});
