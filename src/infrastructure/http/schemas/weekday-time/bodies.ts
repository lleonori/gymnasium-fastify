import { Type } from "@sinclair/typebox";
import CommonSchemas from "../commons/index.js";

export const CreateWeekdayTime = Type.Object({
  weekdayId: Type.Number(),
  timetableId: Type.Array(Type.Number()),
});

export const WeekdayTimesHour = Type.Object({
  id: Type.Number(),
  hour: Type.String({ format: "time" }),
});

export const WeekdayTime = Type.Object({
  weekdayId: Type.Number(),
  weekdayName: Type.String(),
  hour: Type.Array(WeekdayTimesHour),
});

export const WeekdayTimePaginated =
  CommonSchemas.Bodies.PaginationResult(WeekdayTime);
