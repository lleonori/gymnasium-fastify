import { PaginatedResult, Pagination, SortBy } from "../commons/models.js";
import { Weekday } from "./models.js";

export interface IWeekdayRepository {
  findAll(
    pagination: Pagination,
    sortBy: SortBy<Weekday>,
  ): Promise<PaginatedResult<Weekday>>;
}
