import { Calendar } from "./models.ts";
import { addDays, format } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

export class CalendarService {
  getDateTimeInItaly = (): Calendar => {
    // Get the current date and time in Italy timezone
    const now: Date = fromZonedTime(new Date(), "Europe/Rome");

    // Format the dates as strings
    const today: string = format(
      fromZonedTime(now, "Europe/Rome"),
      "yyyy-MM-dd"
    );
    const tomorrow: string = format(
      fromZonedTime(addDays(now, 1), "Europe/Rome"),
      "yyyy-MM-dd"
    );

    return { today: today, tomorrow: tomorrow };
  };
}
