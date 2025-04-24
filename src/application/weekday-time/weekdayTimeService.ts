import { PaginatedResult, Pagination, SortBy } from "../commons/models.js";
import { IWeekdayTimeRepository } from "./index.js";
import { WeekdayTime } from "./models.js";

export class WeekdayTimeService {
  constructor(protected readonly weekdayRepository: IWeekdayTimeRepository) {}

  findAll(
    pagination: Pagination,
    sortBy: SortBy<WeekdayTime>,
  ): Promise<PaginatedResult<WeekdayTime>> {
    return this.weekdayRepository.findAll(pagination, sortBy);
  }
}
