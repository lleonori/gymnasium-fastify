import { NotFoundException } from "../commons/exceptions.js";
import { PaginatedResult, Pagination, SortBy } from "../commons/models.js";
import {
  CreateTimetable,
  FilterTimetable,
  Timetable,
  UpdateTimetable,
} from "./models.js";
import { ITimetableRepository } from "./timetableRepository.js";

export class TimetableService {
  constructor(protected readonly timetableRepository: ITimetableRepository) {}

  create(timetable: CreateTimetable): Promise<Timetable> {
    return this.timetableRepository.create(timetable);
  }

  findAll(
    filterBy: FilterTimetable,
    pagination: Pagination,
    sortBy: SortBy<Timetable>,
  ): Promise<PaginatedResult<Timetable>> {
    return this.timetableRepository.findAll(filterBy, pagination, sortBy);
  }

  async findById(id: Timetable["id"]): Promise<Timetable> {
    const timetable = await this.timetableRepository.findById(id);
    this.handleNotFound(timetable, id);
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
