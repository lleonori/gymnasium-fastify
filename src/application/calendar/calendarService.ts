import { ICalendarRepository } from "./calendarRepository.ts";
import { Calendar } from "./models.ts";

export class CalendarService {
  constructor(protected readonly calendarRepository: ICalendarRepository) {}

  findAll(): Calendar {
    return this.calendarRepository.findAll();
  }
}
