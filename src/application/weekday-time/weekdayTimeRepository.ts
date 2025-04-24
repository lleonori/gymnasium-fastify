import { PaginatedResult, Pagination, SortBy } from "../commons/models.js";
import { WeekdayTime } from "./models.js";

export interface IWeekdayTimeRepository {
  findAll(
    pagination: Pagination,
    sortBy: SortBy<WeekdayTime>,
  ): Promise<PaginatedResult<WeekdayTime>>;
}
