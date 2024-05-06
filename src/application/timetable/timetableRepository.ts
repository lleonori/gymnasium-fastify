import { PaginatedResult, Pagination, SortBy } from "../commons/models.ts";
import { CreateTimetable, Timetable, UpdateTimetable } from "./models.ts";

export interface ITimetableRepository {
  create(timetable: CreateTimetable): Promise<Timetable>;
  findAll(
    pagination: Pagination,
    sortBy: SortBy<Timetable>
  ): Promise<PaginatedResult<Timetable>>;
  findById(id: Timetable["id"]): Promise<Timetable | undefined>;
  update(
    id: Timetable["id"],
    timetable: UpdateTimetable
  ): Promise<Timetable | undefined>;
  delete(id: Timetable["id"]): Promise<Timetable | undefined>;
}
