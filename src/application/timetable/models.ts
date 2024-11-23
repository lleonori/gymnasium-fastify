export type CreateTimetable = {
  hour: string;
};

export type UpdateTimetable = Partial<CreateTimetable>;

export type Timetable = {
  id: number;
  isValidOnWeekend: boolean;
  createdAt: Date;
  updatedAt: Date;
} & CreateTimetable;
