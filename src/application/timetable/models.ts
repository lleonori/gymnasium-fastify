export type CreateTimetable = {
  hour: string;
  isValidOnWeekend: boolean;
};

export type UpdateTimetable = Partial<CreateTimetable>;

export type Timetable = {
  id: number;
  isValidOnWeekend: boolean;
  createdAt: Date;
  updatedAt: Date;
} & CreateTimetable;
