import { Calendar } from "./models.ts";

export class CalendarService {
  findAll(): Calendar {
    return this.calendarRepository.findAll();
  }
}
