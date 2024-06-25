import { Calendar } from "../../../application/calendar/models.ts";
import { addDays, format } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { PaginatedResult } from "../../../application/commons/models.ts";
import { Booking } from "../../../application/index.ts";

export const getDateTimeInItaly = (): Calendar => {
  // Get the current date and time in Italy timezone
  const now: Date = fromZonedTime(new Date(), "Europe/Rome");

  // Format the dates as strings
  const today: string = format(fromZonedTime(now, "Europe/Rome"), "yyyy-MM-dd");
  const tomorrow: string = format(
    fromZonedTime(addDays(now, 1), "Europe/Rome"),
    "yyyy-MM-dd"
  );

  return { today: today, tomorrow: tomorrow };
};

export const clearBookedDaysFromCalendar = (
  bookings: PaginatedResult<Booking>,
  calendar: Calendar
): Calendar => {
  let calendarResult: Calendar = { ...calendar };
  let bookingExistsToday: boolean = false;
  let bookingExistsTomorrow: boolean = false;

  bookings.data.forEach((booking: Booking) => {
    if (booking.day === calendar.today) {
      bookingExistsToday = true;
    }
    if (booking.day === calendar.tomorrow) {
      bookingExistsTomorrow = true;
    }
  });

  if (bookingExistsToday) {
    calendarResult.today = "";
  }
  if (bookingExistsTomorrow) {
    calendarResult.tomorrow = "";
  }

  return calendarResult;
};
