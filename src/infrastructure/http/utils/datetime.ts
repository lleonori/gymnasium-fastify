import { Calendar } from "../../../application/calendar/models.js";

export const getTodayAndTomorrow = (): Calendar => {
  // Helper to format a date to "yyyy-MM-dd"
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

  const now = new Date();

  // Calculate today and tomorrow
  const today = formatDate(now);
  const tomorrow = formatDate(new Date(now.setDate(now.getDate() + 1)));

  return { today: today, tomorrow: tomorrow };
};

export const getTime = (): string => {
  // Get the current time
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const currentHour = `${hours}:${minutes}:${seconds}Z`;
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

export const formatTime = (time: string): string => {
  // Remove the trailing 'Z' and return the formatted time
  const formattedTime = time.slice(0, -1);
  return formattedTime;
};
