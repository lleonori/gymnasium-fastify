import { Calendar } from "./models.ts";

export interface ICalendarRepository {
  findByMail(mail: string): Promise<Calendar>;
}
