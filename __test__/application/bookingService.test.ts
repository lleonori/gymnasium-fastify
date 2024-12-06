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
} from "../../src/application/booking/index.ts";

const mockBooking: Booking = {
  id: 1,
  fullName: "Lorenzo Leonori",
  mail: "lorenzo.leonori.93@gmail.com",
  day: "06/12/2024",
  hour: "9:00",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("BookingService", () => {
  let mockedBookingRepository: Mocked<IBookingRepository>;
  let bookingService: BookingService;

  beforeEach(() => {
    mockedBookingRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findByMail: vi.fn(),
      countAllBookingsByDayAndMail: vi.fn(),
      countAllBookingsByDay: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    bookingService = new BookingService(mockedBookingRepository);
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
        { fullName: "Lorenzo" },
        { limit: 0, offset: 10 },
        [["id", "asc"]],
      );

      expect(findAllBooking).toEqual({
        count: 1,
        data: [mockBooking],
      });
      expect(mockedBookingRepository.findAll).toHaveBeenCalledOnce();
      expect(mockedBookingRepository.findAll).toHaveBeenCalledWith(
        { fullName: "Lorenzo" },
        { limit: 0, offset: 10 },
        [["id", "asc"]],
      );
    });
  });

  describe("find by mail", () => {
    test("should find a booking by mail", async () => {
      mockedBookingRepository.findByMail.mockResolvedValue({
        count: 1,
        data: [mockBooking],
      });

      const findBookingByMail = await bookingService.findByMail(
        { today: "06/12/2024", tomorrow: "07/12/2024" },
        "lorenzo.leonori.93@gmail.com",
        { limit: 0, offset: 10 },
        [["id", "asc"]],
      );

      expect(findBookingByMail).toEqual({
        count: 1,
        data: [mockBooking],
      });
      expect(mockedBookingRepository.findByMail).toHaveBeenCalledOnce();
      expect(mockedBookingRepository.findByMail).toHaveBeenCalledWith(
        { today: "06/12/2024", tomorrow: "07/12/2024" },
        "lorenzo.leonori.93@gmail.com",
        { limit: 0, offset: 10 },
        [["id", "asc"]],
      );
    });
  });

  describe("count all bookings by day", () => {
    test("should count all bookings by day", async () => {
      mockedBookingRepository.countAllBookingsByDay.mockResolvedValue(1);

      const cabbd = await bookingService.countAllBookingsByDay(new Date());

      expect(cabbd).toEqual(1);
      expect(
        mockedBookingRepository.countAllBookingsByDay,
      ).toHaveBeenCalledOnce();
      expect(
        mockedBookingRepository.countAllBookingsByDay,
      ).toHaveBeenCalledWith(new Date());
    });
  });

  describe("count all bookings by day and mail", () => {
    test("should count all bookings by day and mail", async () => {
      mockedBookingRepository.countAllBookingsByDayAndMail.mockResolvedValue(1);

      const cabbdam = await bookingService.countAllBookingsByDayAndMail(
        new Date(),
        "lorenzo.leonori.93@gmail.com",
      );

      expect(cabbdam).toEqual(1);
      expect(
        mockedBookingRepository.countAllBookingsByDayAndMail,
      ).toHaveBeenCalledOnce();
      expect(
        mockedBookingRepository.countAllBookingsByDayAndMail,
      ).toHaveBeenCalledWith(new Date(), "lorenzo.leonori.93@gmail.com");
    });
  });

  describe("create", () => {
    test("should create a booking", async () => {
      mockedBookingRepository.create.mockResolvedValue(mockBooking);

      const createdBooking = await bookingService.create({
        fullName: "Lorenzo Leonori",
        mail: "lorenzo.leonori.93@gmail.com",
        day: "06/12/2024",
        hour: "9:00",
      });

      expect(createdBooking).toEqual(mockBooking);
      expect(mockedBookingRepository.create).toHaveBeenCalledOnce();
      expect(mockedBookingRepository.create).toHaveBeenCalledWith({
        fullName: "Lorenzo Leonori",
        mail: "lorenzo.leonori.93@gmail.com",
        day: "06/12/2024",
        hour: "9:00",
      });
    });
  });

  describe("update", () => {
    test("should update a booking", async () => {
      mockedBookingRepository.update.mockResolvedValue(mockBooking);

      const updateBooking = await bookingService.update(1, {
        fullName: "Lorenzo Leonori",
        mail: "lorenzo.leonori.93@gmail.com",
        day: "06/12/2024",
        hour: "9:00",
      });

      expect(updateBooking).toEqual(mockBooking);
      expect(mockedBookingRepository.update).toHaveBeenCalledOnce();
      expect(mockedBookingRepository.update).toHaveBeenCalledWith(1, {
        fullName: "Lorenzo Leonori",
        mail: "lorenzo.leonori.93@gmail.com",
        day: "06/12/2024",
        hour: "9:00",
      });
    });

    test("should thrown an error if not fuond a booking", async () => {
      mockedBookingRepository.update.mockResolvedValue(undefined);

      await expect(
        bookingService.update(1, {
          fullName: "Lorenzo Leonori",
          mail: "lorenzo.leonori.93@gmail.com",
          day: "06/12/2024",
          hour: "9:00",
        }),
      ).rejects.toThrow("Booking with id 1 not found");
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
