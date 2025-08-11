import { NotFoundException } from "../commons/exceptions.js";
import { PaginatedResult, Pagination, SortBy } from "../commons/models.js";
import { CreateTimetable, FilterTimetable, Timetable } from "./models.js";
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

  private handleNotFound(
    timetable: Timetable | undefined,
    id: Timetable["id"],
  ): asserts timetable is Timetable {
    if (!timetable)
      throw new NotFoundException(`Orario con id ${id} non trovato`);
  }
}
