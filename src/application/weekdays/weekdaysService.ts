import { PaginatedResult, Pagination, SortBy } from "../commons/models.js";
import { Weekdays } from "./models.js";
import { IWeekdaysRepository } from "./weekdaysRepository.js";

export class WeekdaysService {
  constructor(protected readonly weekdaysRepository: IWeekdaysRepository) {}

  findAll(
    pagination: Pagination,
    sortBy: SortBy<Weekdays>,
  ): Promise<PaginatedResult<Weekdays>> {
    return this.weekdaysRepository.findAll(pagination, sortBy);
  }
}
