import { PaginatedResult, Pagination, SortBy } from "../commons/models.js";
import { Weekdays } from "./models.js";

export interface IWeekdaysRepository {
  findAll(
    pagination: Pagination,
    sortBy: SortBy<Weekdays>,
  ): Promise<PaginatedResult<Weekdays>>;
}
