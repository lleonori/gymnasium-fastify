import { PaginatedResult, Pagination, SortBy } from "../commons/models.js";
import { Weekday } from "./models.js";
import { IWeekdayRepository } from "./weekdayRepository.js";

export class WeekdayService {
  constructor(protected readonly weekdayRepository: IWeekdayRepository) {}

  findAll(
    pagination: Pagination,
    sortBy: SortBy<Weekday>,
  ): Promise<PaginatedResult<Weekday>> {
    return this.weekdayRepository.findAll(pagination, sortBy);
  }
}
