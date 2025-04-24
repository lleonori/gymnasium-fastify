import { Type } from "@sinclair/typebox";
import CommonSchemas from "../commons/index.js";

export const UpdateWeekdayTime = Type.Object({
  weekday: Type.Number(),
  timetableId: Type.Number(),
});

export const WeekdayTime = Type.Intersect([
  Type.Object({
    id: Type.Number(),
  }),
  UpdateWeekdayTime,
]);

export const WeekdayTimePaginated =
  CommonSchemas.Bodies.PaginationResult(WeekdayTime);
