import { Calendar } from "../../../application/calendar/models.js";

export const getDateInItaly = (): Calendar => {
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
    now.toLocaleString("en-US", { timeZone: "Europe/Rome" }),
  );

  // Calculate today and tomorrow
  const today = formatDate(italyTime);
  const tomorrow = formatDate(
    new Date(italyTime.setDate(italyTime.getDate() + 1)),
  );

  return { today: today, tomorrow: tomorrow };
};

export const getTimeInItaly = (): string => {
  // Helper to format a date to "yyyy-MM-dd" in the Italy timezone
  const formatHour = (date: Date) => {
    return new Intl.DateTimeFormat("it-IT", {
      timeZone: "Europe/Rome",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  // Get the current date and time in Italy timezone
  const now = new Date();
  const italyTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Rome" }),
  );

  // Calculate current hour in Italy
  const currentHour = formatHour(italyTime);
  return currentHour;
};

export const formatTimeInSecond = (time: string): number => {
  // hour format is "HH:mm:ss"
  const timeArray = time.split(":");
  const hourInt = parseInt(timeArray[0]) * 3600;
  const minuteInt = parseInt(timeArray[1]) * 60;
  const secondInt = parseInt(timeArray[2] ? timeArray[2] : "00");
  return hourInt + minuteInt + secondInt;
};
