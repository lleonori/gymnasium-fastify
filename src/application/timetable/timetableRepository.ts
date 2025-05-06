import { PaginatedResult, Pagination, SortBy } from "../commons/models.js";
import {
  CreateTimetable,
  FilterTimetable,
  Timetable,
  UpdateTimetable,
} from "./models.js";

export interface ITimetableRepository {
  create(timetable: CreateTimetable): Promise<Timetable>;
  findAll(
    filterBy: FilterTimetable,
    pagination: Pagination,
    sortBy: SortBy<Timetable>,
  ): Promise<PaginatedResult<Timetable>>;
  findById(id: Timetable["id"]): Promise<Timetable | undefined>;
  update(
    id: Timetable["id"],
    timetable: UpdateTimetable,
  ): Promise<Timetable | undefined>;
  delete(id: Timetable["id"]): Promise<Timetable | undefined>;
}
