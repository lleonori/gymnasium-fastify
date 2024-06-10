import { addDays } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import {
  Calendar,
  ICalendarRepository,
} from "../../application/calendar/index.ts";

export class CalendarDao implements ICalendarRepository {
  constructor(protected readonly db: Kysely<DB>) {}

  findAll(): Calendar {
    const { today, tomorrow } = this.getDateTimeInItaly();
    return { today: today, tomorrow: tomorrow };
  }

  getDateTimeInItaly(): Calendar {
    // Get the current date and time in UTC with Italy timezone
    const now = fromZonedTime(new Date(), "Europe/Rome");

    // Get tomorrow's date in UTC with Italy timezone
    const tomorrow = addDays(now, 1);

    return { today: now, tomorrow: tomorrow };
  }
}
