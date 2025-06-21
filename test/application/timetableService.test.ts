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
  ITimetableRepository,
  Timetable,
  TimetableService,
} from "../../src/application/timetable/index.js";
import {
  BookingService,
  IBookingRepository,
} from "../../src/application/booking/index.js";
import { TimetableBookingManagerService } from "../../src/application/timetable-booking-manager/index.js";

const mockTimetable: Timetable = {
  id: 1,
  startHour: "9:00",
  endHour: "10:30",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("TimetableService", () => {
  let mockedBookingRepository: Mocked<IBookingRepository>;
  let mockedTimetableRepository: Mocked<ITimetableRepository>;
  let bookingService: BookingService;
  let timetableService: TimetableService;
  let timetableBookingManagerService: TimetableBookingManagerService;

  beforeEach(() => {
    mockedTimetableRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    mockedBookingRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      countBookingsForDayAndEmail: vi.fn(),
      countBookingsForDayAndTimetableId: vi.fn(),
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
    test("should find all timetable", async () => {
      mockedTimetableRepository.findAll.mockResolvedValue({
        count: 1,
        data: [mockTimetable],
      });

      const findAllTimetable = await timetableService.findAll(
        {},
        { limit: 0, offset: 10 },
        [["id", "asc"]],
      );

      expect(findAllTimetable).toEqual({
        count: 1,
        data: [mockTimetable],
      });
      expect(mockedTimetableRepository.findAll).toHaveBeenCalledOnce();
      expect(mockedTimetableRepository.findAll).toHaveBeenCalledWith(
        {},
        { limit: 0, offset: 10 },
        [["id", "asc"]],
      );
    });
  });

  describe("find by id", () => {
    test("should find a timetable by id", async () => {
      mockedTimetableRepository.findById.mockResolvedValue(mockTimetable);

      const findTimetableById = await timetableService.findById(1);

      expect(findTimetableById).toEqual(mockTimetable);
      expect(mockedTimetableRepository.findById).toHaveBeenCalledOnce();
      expect(mockedTimetableRepository.findById).toHaveBeenCalledWith(1);
    });

    test("should thrown an error if not fuond a timetable", async () => {
      mockedTimetableRepository.findById.mockResolvedValue(undefined);

      await expect(timetableService.findById(1)).rejects.toThrow(
        "Timetable with id 1 not found",
      );
    });
  });

  describe("create", () => {
    test("should create a timetable", async () => {
      mockedTimetableRepository.create.mockResolvedValue(mockTimetable);

      const createdTimetable = await timetableService.create({
        startHour: "10:00",
        endHour: "11:00",
      });

      expect(createdTimetable).toEqual(mockTimetable);
      expect(mockedTimetableRepository.create).toHaveBeenCalledOnce();
      expect(mockedTimetableRepository.create).toHaveBeenCalledWith({
        startHour: "10:00",
        endHour: "11:00",
      });
    });
  });

  describe("update", () => {
    test("should update a timetable", async () => {
      bookingService.findAll = vi.fn().mockResolvedValue({
        count: 0,
        rows: [],
      });

      mockedTimetableRepository.update.mockResolvedValue(mockTimetable);

      const updateTimetable = await timetableBookingManagerService.update(1, {
        startHour: "11:00",
        endHour: "12:00",
      });

      expect(updateTimetable).toEqual(mockTimetable);
      expect(mockedTimetableRepository.update).toHaveBeenCalledOnce();
      expect(mockedTimetableRepository.update).toHaveBeenCalledWith(1, {
        startHour: "11:00",
        endHour: "12:00",
      });
    });

    test("should thrown an error if not found a timetable", async () => {
      bookingService.findAll = vi.fn().mockResolvedValue({
        count: 0,
        rows: [],
      });

      mockedTimetableRepository.update.mockResolvedValue(undefined);

      await expect(
        timetableBookingManagerService.update(1, {
          startHour: "13:00",
          endHour: "14:00",
        }),
      ).rejects.toThrow("Timetable with id 1 not found");
    });
  });

  describe("delete", () => {
    test("should delete a timetable", async () => {
      bookingService.findAll = vi.fn().mockResolvedValue({
        count: 0,
        rows: [],
      });

      mockedTimetableRepository.delete.mockResolvedValue(mockTimetable);

      const deleteTimetable = await timetableBookingManagerService.delete(1);

      expect(deleteTimetable).toEqual(mockTimetable);
      expect(mockedTimetableRepository.delete).toHaveBeenCalledOnce();
      expect(mockedTimetableRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
