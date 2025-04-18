import { NotFoundException } from "../commons/exceptions.js";
import { PaginatedResult, Pagination, SortBy } from "../commons/models.js";
import { CreateTimetable, Timetable, UpdateTimetable } from "./models.js";
import { ITimetableRepository } from "./timetableRepository.js";

export class TimetableService {
  constructor(protected readonly timetableRepository: ITimetableRepository) {}

  create(timetable: CreateTimetable): Promise<Timetable> {
    return this.timetableRepository.create(timetable);
  }

  findAll(
    pagination: Pagination,
    sortBy: SortBy<Timetable>,
  ): Promise<PaginatedResult<Timetable>> {
    return this.timetableRepository.findAll(pagination, sortBy);
  }

  async findById(id: Timetable["id"]): Promise<Timetable> {
    const timetable = await this.timetableRepository.findById(id);
    this.handleNotFound(timetable, id);
    return timetable;
  }

  async findByHourAndIsValidOnWeekend(
    hour: Timetable["hour"],
    isValidOnWeekend: boolean,
  ): Promise<Timetable | undefined> {
    return this.timetableRepository.findByHourAndIsValidOnWeekend(
      hour,
      isValidOnWeekend,
    );
  }

  async findByDate(
    date: string,
    pagination: Pagination,
    sortBy: SortBy<Timetable>,
  ): Promise<PaginatedResult<Timetable>> {
    const timetable = await this.timetableRepository.findByDate(
      date,
      pagination,
      sortBy,
    );
    return timetable;
  }

  async update(
    id: Timetable["id"],
    timetable: UpdateTimetable,
  ): Promise<Timetable> {
    const updatedTimetable = await this.timetableRepository.update(
      id,
      timetable,
    );
    this.handleNotFound(updatedTimetable, id);
    return updatedTimetable;
  }

  async delete(id: Timetable["id"]): Promise<Timetable> {
    const deletedTimetable = await this.timetableRepository.delete(id);
    this.handleNotFound(deletedTimetable, id);
    return deletedTimetable;
  }

  private handleNotFound(
    timetable: Timetable | undefined,
    id: Timetable["id"],
  ): asserts timetable is Timetable {
    if (!timetable)
      throw new NotFoundException(`Timetable with id ${id} not found`);
  }
}
