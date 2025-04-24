export type UpdateWeekdayTime = {
  weekday: number;
  timetableId: number;
};

export type WeekdayTime = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
} & UpdateWeekdayTime;
