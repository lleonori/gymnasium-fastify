import { PaginatedResult, Pagination } from "../commons/models.js";
import { CreateWeekdayTime, WeekdayTime } from "./models.js";

export interface IWeekdayTimeRepository {
  create(weekdayTime: CreateWeekdayTime): Promise<WeekdayTime>;
  findAll(pagination: Pagination): Promise<PaginatedResult<WeekdayTime>>;
}
