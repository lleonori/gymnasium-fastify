import { Calendar } from "../../../application/calendar/models.ts";

export const getDateTimeInItaly = (): Calendar => {
  // Helper to format a date to "yyyy-MM-dd" in the Italy timezone
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("it-IT", {
      timeZone: "Europe/Rome",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .format(date)
      .split("/")
      .reverse()
      .join("-");
  };

  // Get the current date and time in Italy timezone
  const now = new Date();
  const italyTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Rome" })
  );

  // Calculate today and tomorrow
  const today = formatDate(italyTime);
  const tomorrow = formatDate(
    new Date(italyTime.setDate(italyTime.getDate() + 1))
  );

  return { today: today, tomorrow: tomorrow };
};
