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
    // Get the current date and time in Italy
    const italyTime = new Date().toLocaleString("it-IT", {
      timeZone: "Europe/Rome",
      dateStyle: "short",
    });

    // Get the date and time for tomorrow in Italy
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowItalyTime = tomorrow.toLocaleString("it-IT", {
      timeZone: "Europe/Rome",
      dateStyle: "short",
    });

    return { today: italyTime, tomorrow: tomorrowItalyTime };
  }
}
