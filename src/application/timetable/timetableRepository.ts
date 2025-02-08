import { PaginatedResult, Pagination, SortBy } from "../commons/models.js";
import { CreateTimetable, Timetable, UpdateTimetable } from "./models.js";

export interface ITimetableRepository {
  create(timetable: CreateTimetable): Promise<Timetable>;
  findAll(
    pagination: Pagination,
    sortBy: SortBy<Timetable>,
  ): Promise<PaginatedResult<Timetable>>;
  findById(id: Timetable["id"]): Promise<Timetable | undefined>;
  findByDate(
    date: string,
    pagination: Pagination,
    sortBy: SortBy<Timetable>,
  ): Promise<PaginatedResult<Timetable>>;
  update(
    id: Timetable["id"],
    timetable: UpdateTimetable,
  ): Promise<Timetable | undefined>;
  delete(id: Timetable["id"]): Promise<Timetable | undefined>;
}
