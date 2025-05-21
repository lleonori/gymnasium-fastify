import { FastifyInstance } from "fastify";
import { reverse } from "rambda";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import { CoachDao } from "../../../../../../src/infrastructure/dao/coachDao.js";
import PgDockerController from "../../../../../PgDockerController.js";
import { createServer } from "../../../../../utils/buildServer.js";

describe(`GET /v1/coachs`, () => {
  const pgDockerController = new PgDockerController();
  let server: FastifyInstance;
  let coachDao: CoachDao;
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
    coachDao = new CoachDao(pgDockerController.db);

    // Popola la tabella coachs con 10 coach
    for (let i = 0; i < 10; i++) {
      await coachDao.create({
        name: `CoachName${i}`,
        surname: `CoachSurname${i}`,
        notes: `Note${i}`,
      });
    }
  });

  describe("GET /", () => {
    test("should return all coachs", async () => {
      const expectedResult = {
        count: 10,
        data: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: `CoachName${i}`,
          surname: `CoachSurname${i}`,
          notes: `Note${i}`,
        })),
      };

      const response = await server.inject({
        method: "GET",
        url: "api/v1/coach",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject(expectedResult);
    });

    test("should return paginated list", async () => {
      const expectedResult = {
        count: 10,
        data: Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          name: `CoachName${i}`,
          surname: `CoachSurname${i}`,
          notes: `Note${i}`,
        })),
      };

      const response = await server.inject({
        method: "GET",
        url: `/api/v1/coach?limit=5&offset=0`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject(expectedResult);
    });

    test("should return sorted list", async () => {
      const expectedResult = {
        count: 10,
        data: reverse(
          Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            name: `CoachName${i}`,
            surname: `CoachSurname${i}`,
            notes: `Note${i}`,
          })),
        ),
      };

      const response = await server.inject({
        method: "GET",
        url: `/api/v1/coach?sort=id.desc`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject(expectedResult);
    });
  });

  describe("GET /:coachId", () => {
    test(`should return 404 if coach doesn't exist`, async () => {
      const response = await server.inject({
        method: "GET",
        url: `/api/v1/coach/9999`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
