import { Type } from "@sinclair/typebox";
import CommonSchemas from "../commons/index.js";

export const CreateTimetable = Type.Object({
  hour: Type.String({ format: "time" }),
  isValidOnWeekend: Type.Boolean(),
});

export const UpdateTimetable = Type.Partial(CreateTimetable);

export const Timetable = Type.Intersect([
  Type.Object({
    id: Type.Number(),
  }),
  CreateTimetable,
]);

export const TimetablesPaginated =
  CommonSchemas.Bodies.PaginationResult(Timetable);
