import { PaginatedResult, Pagination } from "../commons/models.js";
import { IWeekdayTimeRepository } from "./index.js";
import { CreateWeekdayTime, WeekdayTime } from "./models.js";

export class WeekdayTimeService {
  constructor(
    protected readonly weekdayTimeRepository: IWeekdayTimeRepository,
  ) {}

  create(weekdayTime: CreateWeekdayTime): Promise<WeekdayTime> {
    return this.weekdayTimeRepository.create(weekdayTime);
  }

  findAll(pagination: Pagination): Promise<PaginatedResult<WeekdayTime>> {
    return this.weekdayTimeRepository.findAll(pagination);
  }
}
