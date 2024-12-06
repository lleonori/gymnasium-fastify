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
} from "../../src/application/timetable/index.ts";

const mockTimetable: Timetable = {
  id: 1,
  hour: "9:00",
  isValidOnWeekend: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("TimetableService", () => {
  let mockedTimetableRepository: Mocked<ITimetableRepository>;
  let timetableService: TimetableService;

  beforeEach(() => {
    mockedTimetableRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      findByDate: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    timetableService = new TimetableService(mockedTimetableRepository);
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
        { limit: 0, offset: 10 },
        [["id", "asc"]]
      );

      expect(findAllTimetable).toEqual({
        count: 1,
        data: [mockTimetable],
      });
      expect(mockedTimetableRepository.findAll).toHaveBeenCalledOnce();
      expect(mockedTimetableRepository.findAll).toHaveBeenCalledWith(
        { limit: 0, offset: 10 },
        [["id", "asc"]]
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
        "Timetable with id 1 not found"
      );
    });
  });

  describe("create", () => {
    test("should create a timetable", async () => {
      mockedTimetableRepository.create.mockResolvedValue(mockTimetable);

      const createdTimetable = await timetableService.create({
        hour: "10:00",
      });

      expect(createdTimetable).toEqual(mockTimetable);
      expect(mockedTimetableRepository.create).toHaveBeenCalledOnce();
      expect(mockedTimetableRepository.create).toHaveBeenCalledWith({
        hour: "10:00",
      });
    });
  });

  describe("update", () => {
    test("should update a timetable", async () => {
      mockedTimetableRepository.update.mockResolvedValue(mockTimetable);

      const updateTimetable = await timetableService.update(1, {
        hour: "11:00",
      });

      expect(updateTimetable).toEqual(mockTimetable);
      expect(mockedTimetableRepository.update).toHaveBeenCalledOnce();
      expect(mockedTimetableRepository.update).toHaveBeenCalledWith(1, {
        hour: "11:00",
      });
    });

    test("should thrown an error if not fuond a timetable", async () => {
      mockedTimetableRepository.update.mockResolvedValue(undefined);

      await expect(
        timetableService.update(1, {
          hour: "13:00",
        })
      ).rejects.toThrow("Timetable with id 1 not found");
    });
  });

  describe("delete", () => {
    test("should delete a timetable", async () => {
      mockedTimetableRepository.delete.mockResolvedValue(mockTimetable);

      const deleteTimetable = await timetableService.delete(1);

      expect(deleteTimetable).toEqual(mockTimetable);
      expect(mockedTimetableRepository.delete).toHaveBeenCalledOnce();
      expect(mockedTimetableRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
