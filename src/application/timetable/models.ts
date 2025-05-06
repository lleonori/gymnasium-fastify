export type CreateTimetable = {
  hour: string;
};

export type UpdateTimetable = Partial<CreateTimetable>;

export type Timetable = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
} & CreateTimetable;

export type FilterTimetable = Partial<CreateTimetable> & {
  weekdayId?: number;
};
