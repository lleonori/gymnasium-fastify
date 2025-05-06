import { PaginatedResult, Pagination, SortBy } from "../commons/models.js";
import { CreateWeekdayTime, WeekdayTime } from "./models.js";

export interface IWeekdayTimeRepository {
  create(weekdayTime: CreateWeekdayTime): Promise<WeekdayTime>;
  findAll(
    pagination: Pagination,
    sortBy: SortBy<WeekdayTime>,
  ): Promise<PaginatedResult<WeekdayTime>>;
}
