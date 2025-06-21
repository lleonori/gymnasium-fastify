import { reverse } from "rambda";
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import { BookingDao } from "../../../src/infrastructure/dao/bookingDao.js";
import { TimetableDao } from "../../../src/infrastructure/dao/timetableDao.js";
import { WeekdayTimeDao } from "../../../src/infrastructure/dao/weekdayTimeDao.js";
import PgDockerController from "../../PgDockerController.js";

describe("BookingDao", () => {
  const pgDockerController = new PgDockerController();
  let bookingDao: BookingDao;
  let timetableDao: TimetableDao;
  let weekdayTimeDao: WeekdayTimeDao;

  beforeAll(async () => await pgDockerController.setup());

  beforeEach(async () => {
    bookingDao = new BookingDao(pgDockerController.db);
    timetableDao = new TimetableDao(pgDockerController.db);
    weekdayTimeDao = new WeekdayTimeDao(pgDockerController.db);
    await pgDockerController.db
      .insertInto("weekdays")
      .values({
        id: 1,
        name: "Lunedì",
      })
      .executeTakeFirst();

    await timetableDao.create({
      startHour: "09:00:00",
      endHour: "10:00:00",
    });

    await weekdayTimeDao.create({
      weekdayId: 1,
      timetableId: [1],
    });
  });

  afterEach(async () => await pgDockerController.reset());

  // afterAll(async () => {
  //   await pgDockerController.tearDown();
  // });

  describe("create", () => {
    test("should create a booking", async () => {
      const bookingData = {
        day: "2024-05-20",
        timetableId: 1,
        mail: "user@example.com",
        fullname: "Test User",
      };

      const booking = await bookingDao.create(bookingData);

      expect(booking).toStrictEqual({
        id: expect.any(Number),
        day: "2024-05-20",
        timetableId: 1,
        mail: "user@example.com",
        fullname: "Test User",
        startHour: "09:00:00",
        endHour: "10:00:00",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe("findAll", () => {
    beforeEach(async () => {
      for (let i = 0; i < 10; i++) {
        await bookingDao.create({
          day: `2024-05-${String(i + 10).padStart(2, "0")}`,
          timetableId: 1,
          mail: `user${i}@test.com`,
          fullname: `User ${i}`,
        });
      }
    });

    test("should return all bookings", async () => {
      const expectedResult = {
        count: 10,
        data: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          day: `2024-05-${String(i + 10).padStart(2, "0")}`,
          timetableId: 1,
          mail: `user${i}@test.com`,
          fullname: `User ${i}`,
          startHour: "09:00:00",
          endHour: "10:00:00",
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })),
      };

      const bookings = await bookingDao.findAll(
        {},
        {
          limit: 10,
          offset: 0,
        },
        [["id", "asc"]],
      );

      expect(bookings).toStrictEqual(expectedResult);
    });

    test("should return paginated bookings", async () => {
      const expectedResult = {
        count: 10,
        data: Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          day: `2024-05-${String(i + 10).padStart(2, "0")}`,
          timetableId: 1,
          mail: `user${i}@test.com`,
          fullname: `User ${i}`,
          startHour: "09:00:00",
          endHour: "10:00:00",
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })),
      };

      const bookings = await bookingDao.findAll(
        {},
        {
          limit: 5,
          offset: 0,
        },
        [["id", "asc"]],
      );

      expect(bookings).toStrictEqual(expectedResult);
    });

    test("should return sorted bookings", async () => {
      const expectedResult = {
        count: 10,
        data: reverse(
          Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            day: `2024-05-${String(i + 10).padStart(2, "0")}`,
            timetableId: 1,
            mail: `user${i}@test.com`,
            fullname: `User ${i}`,
            startHour: "09:00:00",
            endHour: "10:00:00",
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          })),
        ),
      };

      const bookings = await bookingDao.findAll(
        {},
        {
          limit: 10,
          offset: 0,
        },
        [["id", "desc"]],
      );

      expect(bookings).toStrictEqual(expectedResult);
    });
  });

  describe("countBookingsForDayAndEmail", () => {
    test("should count bookings for a given day and email", async () => {
      await bookingDao.create({
        day: "2024-05-20",
        timetableId: 1,
        mail: "user@example.com",
        fullname: "Test User",
      });
      const count = await bookingDao.countBookingsForDayAndEmail(
        new Date("2024-05-20"),
        "user@example.com",
      );
      expect(count).toBe(1);
    });
  });

  describe("countBookingsForDayAndTimetableId", () => {
    test("should count bookings for a given day and timetableId", async () => {
      await bookingDao.create({
        day: "2024-05-20",
        timetableId: 1,
        mail: "user@example.com",
        fullname: "Test User",
      });
      const count = await bookingDao.countBookingsForDayAndTimetableId(
        new Date("2024-05-20"),
        1,
      );
      expect(count).toBe(1);
    });
  });

  describe("delete", () => {
    let bookingId: number;
    beforeEach(async () => {
      const booking = await bookingDao.create({
        day: "2024-05-20",
        timetableId: 1,
        mail: "user@example.com",
        fullname: "Test User",
      });
      bookingId = booking.id;
    });

    test("should delete a booking", async () => {
      const booking = await bookingDao.delete(bookingId);
      expect(booking).toStrictEqual({
        id: bookingId,
        day: "2024-05-20",
        timetableId: 1,
        mail: "user@example.com",
        fullname: "Test User",
        startHour: "09:00:00",
        endHour: "10:00:00",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      const deletedBooking = await bookingDao.findById(bookingId);
      expect(deletedBooking).toBeUndefined();
    });
  });
});
