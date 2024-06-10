import { Calendar } from "./models.ts";

export interface ICalendarRepository {
  findAll(): Calendar;
}
