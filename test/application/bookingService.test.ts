import {
  afterEach,
  beforeEach,
  describe,
  expect,
  Mocked,
  test,
  vi,
} from "vitest";
import {
  IBookingRepository,
  Booking,
  BookingService,
} from "../../src/application/booking/index.js";
import { TimetableBookingManagerService } from "../../src/application/timetable-booking-manager/timetableBookingManagerService.js";
import {
  ITimetableRepository,
  TimetableService,
} from "../../src/application/timetable/index.js";
import { getTodayAndTomorrow } from "../../src/infrastructure/http/utils/datetime.js";

const { today } = getTodayAndTomorrow();

const mockBooking: Booking = {
  id: 1,
  fullname: "Lorenzo Leonori",
  mail: "lorenzo.leonori.93@gmail.com",
  day: today,
  timetableId: 1,
  startHour: "9:00",
  endHour: "10:30",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("BookingService", () => {
  let mockedBookingRepository: Mocked<IBookingRepository>;
  let mockedTimetableRepository: Mocked<ITimetableRepository>;
  let bookingService: BookingService;
  let timetableService: TimetableService;
  let timetableBookingManagerService: TimetableBookingManagerService;

  beforeEach(() => {
    mockedBookingRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      countBookingsForDayAndEmail: vi.fn(),
      countBookingsForDayAndTimetableId: vi.fn(),
      delete: vi.fn(),
    };

    mockedTimetableRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    bookingService = new BookingService(mockedBookingRepository);
    timetableService = new TimetableService(mockedTimetableRepository);
    timetableBookingManagerService = new TimetableBookingManagerService(
      timetableService,
      bookingService,
      mockedTimetableRepository,
      mockedBookingRepository,
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("find all", () => {
    test("should find all booking", async () => {
      mockedBookingRepository.findAll.mockResolvedValue({
        count: 1,
        data: [mockBooking],
      });

      const findAllBooking = await bookingService.findAll(
        { mail: "Lorenzo" },
        { limit: 0, offset: 10 },
        [["id", "asc"]],
      );

      expect(findAllBooking).toEqual({
        count: 1,
        data: [mockBooking],
      });
      expect(mockedBookingRepository.findAll).toHaveBeenCalledOnce();
      expect(mockedBookingRepository.findAll).toHaveBeenCalledWith(
        { mail: "Lorenzo" },
        { limit: 0, offset: 10 },
        [["id", "asc"]],
      );
    });
  });

  describe("find by mail", () => {
    test("should find a booking by mail", async () => {
      mockedBookingRepository.findAll.mockResolvedValue({
        count: 1,
        data: [mockBooking],
      });

      const findBookingByMail = await bookingService.findAll(
        { mail: "lorenzo.leonori.93@gmail.com" },
        { limit: 0, offset: 10 },
        [["id", "asc"]],
      );

      expect(findBookingByMail).toEqual({
        count: 1,
        data: [mockBooking],
      });
      expect(mockedBookingRepository.findAll).toHaveBeenCalledOnce();
      expect(mockedBookingRepository.findAll).toHaveBeenCalledWith(
        { mail: "lorenzo.leonori.93@gmail.com" },
        { limit: 0, offset: 10 },
        [["id", "asc"]],
      );
    });
  });

  describe("count all bookings by day and mail", () => {
    test("should count all bookings by day and mail", async () => {
      mockedBookingRepository.countBookingsForDayAndEmail.mockResolvedValue(1);

      const countBookingsForDayAndEmail =
        await bookingService.countBookingsForDayAndEmail(
          new Date(),
          "lorenzo.leonori.93@gmail.com",
        );

      expect(countBookingsForDayAndEmail).toEqual(1);
      expect(
        mockedBookingRepository.countBookingsForDayAndEmail,
      ).toHaveBeenCalledOnce();
      expect(
        mockedBookingRepository.countBookingsForDayAndEmail,
      ).toHaveBeenCalledWith(new Date(), "lorenzo.leonori.93@gmail.com");
    });
  });

  describe("count all bookings by day and mail", () => {
    test("should count all bookings by day and mail", async () => {
      mockedBookingRepository.countBookingsForDayAndEmail.mockResolvedValue(1);

      const now = new Date();
      now.setMilliseconds(0);

      const countBookingsForDayAndEmail =
        await bookingService.countBookingsForDayAndEmail(
          now,
          "lorenzo.leonori.93@gmail.com",
        );

      expect(countBookingsForDayAndEmail).toEqual(1);
      expect(
        mockedBookingRepository.countBookingsForDayAndEmail,
      ).toHaveBeenCalledOnce();
      expect(
        mockedBookingRepository.countBookingsForDayAndEmail,
      ).toHaveBeenCalledWith(now, "lorenzo.leonori.93@gmail.com");
    });
  });

  describe("create", () => {
    test("should create a booking", async () => {
      const mockTimetable = {
        id: 1,
        startHour: "15:00",
        endHour: "16:30",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockedTimetableRepository.findById.mockResolvedValue(mockTimetable);
      mockedBookingRepository.create.mockResolvedValue(mockBooking);

      const createdBooking = await timetableBookingManagerService.create({
        fullname: "Lorenzo Leonori",
        mail: "lorenzo.leonori.93@gmail.com",
        day: today,
        timetableId: 1,
      });

      expect(createdBooking).toEqual(mockBooking);
      expect(mockedBookingRepository.create).toHaveBeenCalledOnce();
      expect(mockedBookingRepository.create).toHaveBeenCalledWith({
        fullname: "Lorenzo Leonori",
        mail: "lorenzo.leonori.93@gmail.com",
        day: today,
        timetableId: 1,
      });
    });
  });

  describe("delete", () => {
    test("should delete a booking", async () => {
      mockedBookingRepository.delete.mockResolvedValue(mockBooking);

      const deleteBooking = await bookingService.delete(1);

      expect(deleteBooking).toEqual(mockBooking);
      expect(mockedBookingRepository.delete).toHaveBeenCalledOnce();
      expect(mockedBookingRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
