export type CreateWeekdayTime = {
  weekdayId: number;
  timetableId: number[];
};

export type WeekdayTimesHour = {
  id: number;
  hour: string;
};

export type WeekdayTime = {
  weekdayId: number;
  weekdayName: string;
  hour: WeekdayTimesHour[];
};
