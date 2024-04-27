import { Type } from "@sinclair/typebox";
import CommonSchemas from "../commons/index.ts";

export const CreateTimetable = Type.Object({
  hour: Type.String(),
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
