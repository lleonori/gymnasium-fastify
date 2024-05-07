import { PaginatedResult } from "../commons/models.ts";
import { Calendar } from "./models.ts";

export interface ICalendarRepository {
  findAll(): Calendar;
}
