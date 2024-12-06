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
  ICoachRepository,
  Coach,
  CoachService,
} from "../../src/application/coach/index.ts";

const mockCoach: Coach = {
  id: 1,
  name: "Lorenzo",
  surname: "Leonori",
  image: "/asset/coach/man1.png",
  notes: "Laurea Scienze Motorie",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("CoachService", () => {
  let mockedCoachRepository: Mocked<ICoachRepository>;
  let coachService: CoachService;

  beforeEach(() => {
    mockedCoachRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    coachService = new CoachService(mockedCoachRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("find all", () => {
    test("should find all coach", async () => {
      mockedCoachRepository.findAll.mockResolvedValue({
        count: 1,
        data: [mockCoach],
      });

      const findAllCoach = await coachService.findAll(
        { limit: 0, offset: 10 },
        [["name", "asc"]],
      );

      expect(findAllCoach).toEqual({
        count: 1,
        data: [mockCoach],
      });
      expect(mockedCoachRepository.findAll).toHaveBeenCalledOnce();
      expect(mockedCoachRepository.findAll).toHaveBeenCalledWith(
        { limit: 0, offset: 10 },
        [["name", "asc"]],
      );
    });
  });

  describe("find by id", () => {
    test("should find a coach by id", async () => {
      mockedCoachRepository.findById.mockResolvedValue(mockCoach);

      const findCoachById = await coachService.findById(1);

      expect(findCoachById).toEqual(mockCoach);
      expect(mockedCoachRepository.findById).toHaveBeenCalledOnce();
      expect(mockedCoachRepository.findById).toHaveBeenCalledWith(1);
    });

    test("should thrown an error if not fuond a coach", async () => {
      mockedCoachRepository.findById.mockResolvedValue(undefined);

      await expect(coachService.findById(1)).rejects.toThrow(
        "Coach with id 1 not found",
      );
    });
  });

  describe("create", () => {
    test("should create a coach", async () => {
      mockedCoachRepository.create.mockResolvedValue(mockCoach);

      const createdCoach = await coachService.create({
        name: "Lorenzo",
        surname: "Leonori",
        image: "/asset/coach/man1.png",
        notes: "Laurea Scienze Motorie",
      });

      expect(createdCoach).toEqual(mockCoach);
      expect(mockedCoachRepository.create).toHaveBeenCalledOnce();
      expect(mockedCoachRepository.create).toHaveBeenCalledWith({
        name: "Lorenzo",
        surname: "Leonori",
        image: "/asset/coach/man1.png",
        notes: "Laurea Scienze Motorie",
      });
    });
  });

  describe("update", () => {
    test("should update a coach", async () => {
      mockedCoachRepository.update.mockResolvedValue(mockCoach);

      const updateCoach = await coachService.update(1, {
        name: "Lorenzo",
        surname: "Leonori",
        image: "/asset/coach/man1.png",
        notes: "Laurea Scienze Motorie",
      });

      expect(updateCoach).toEqual(mockCoach);
      expect(mockedCoachRepository.update).toHaveBeenCalledOnce();
      expect(mockedCoachRepository.update).toHaveBeenCalledWith(1, {
        name: "Lorenzo",
        surname: "Leonori",
        image: "/asset/coach/man1.png",
        notes: "Laurea Scienze Motorie",
      });
    });

    test("should thrown an error if not fuond a coach", async () => {
      mockedCoachRepository.update.mockResolvedValue(undefined);

      await expect(
        coachService.update(1, {
          name: "Lorenzo",
          surname: "Leonori",
          image: "/asset/coach/man1.png",
          notes: "Laurea Scienze Motorie",
        }),
      ).rejects.toThrow("Coach with id 1 not found");
    });
  });

  describe("delete", () => {
    test("should delete a coach", async () => {
      mockedCoachRepository.delete.mockResolvedValue(mockCoach);

      const deleteCoach = await coachService.delete(1);

      expect(deleteCoach).toEqual(mockCoach);
      expect(mockedCoachRepository.delete).toHaveBeenCalledOnce();
      expect(mockedCoachRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
