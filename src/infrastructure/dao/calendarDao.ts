import { Kysely } from "kysely";
import { DB } from "kysely-codegen";
import {
  Calendar,
  ICalendarRepository,
} from "../../application/calendar/index.ts";
import { format, addDays } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { it } from "date-fns/locale/it";

export class CalendarDao implements ICalendarRepository {
  constructor(protected readonly db: Kysely<DB>) {}

  findAll(): Calendar {
    const { today, tomorrow } = this.getDateTimeInItaly();
    return { today: today, tomorrow: tomorrow };
  }

  getDateTimeInItaly() {
    // Get the current date and time in UTC with Italy timezone
    const now = fromZonedTime(new Date(), "Europe/Rome");

    // Format the date according to the Italian locale
    const italyTime = format(now, "yyyy/MM/dd", { locale: it });

    // Get tomorrow's date in UTC with Italy timezone
    const tomorrow = addDays(now, 1);

    // Format tomorrow's date according to the Italian locale
    const tomorrowItalyTime = format(tomorrow, "yyyy/MM/dd", {
      locale: it,
    });

    return { today: italyTime, tomorrow: tomorrowItalyTime };
  }
}
