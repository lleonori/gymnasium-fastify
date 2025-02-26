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

const mockBooking: Booking = {
  id: 1,
  fullname: "Lorenzo Leonori",
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
      countBookingsForDayAndEmail: vi.fn(),
      countBookingsForDay: vi.fn(),
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
        { fullname: "Lorenzo" },
        { limit: 0, offset: 10 },
        [["id", "asc"]],
      );

      expect(findAllBooking).toEqual({
        count: 1,
        data: [mockBooking],
      });
      expect(mockedBookingRepository.findAll).toHaveBeenCalledOnce();
      expect(mockedBookingRepository.findAll).toHaveBeenCalledWith(
        { fullname: "Lorenzo" },
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
      mockedBookingRepository.countBookingsForDay.mockResolvedValue(1);

      const cabbd = await bookingService.countBookingsForDay(new Date());

      expect(cabbd).toEqual(1);
      expect(
        mockedBookingRepository.countBookingsForDay,
      ).toHaveBeenCalledOnce();
      expect(mockedBookingRepository.countBookingsForDay).toHaveBeenCalledWith(
        new Date(),
      );
    });
  });

  describe("count all bookings by day and mail", () => {
    test("should count all bookings by day and mail", async () => {
      mockedBookingRepository.countBookingsForDayAndEmail.mockResolvedValue(1);

      const cabbdam = await bookingService.countBookingsForDayAndEmail(
        new Date(),
        "lorenzo.leonori.93@gmail.com",
      );

      expect(cabbdam).toEqual(1);
      expect(
        mockedBookingRepository.countBookingsForDayAndEmail,
      ).toHaveBeenCalledOnce();
      expect(
        mockedBookingRepository.countBookingsForDayAndEmail,
      ).toHaveBeenCalledWith(new Date(), "lorenzo.leonori.93@gmail.com");
    });
  });

  describe("create", () => {
    test("should create a booking", async () => {
      mockedBookingRepository.create.mockResolvedValue(mockBooking);

      const createdBooking = await bookingService.create({
        fullname: "Lorenzo Leonori",
        mail: "lorenzo.leonori.93@gmail.com",
        day: "06/12/2024",
        hour: "9:00",
      });

      expect(createdBooking).toEqual(mockBooking);
      expect(mockedBookingRepository.create).toHaveBeenCalledOnce();
      expect(mockedBookingRepository.create).toHaveBeenCalledWith({
        fullname: "Lorenzo Leonori",
        mail: "lorenzo.leonori.93@gmail.com",
        day: "06/12/2024",
        hour: "9:00",
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
