import { Type } from "@sinclair/typebox";
import CommonSchemas from "../commons/index.js";

export const Weekday = Type.Intersect([
  Type.Object({
    id: Type.Number(),
    name: Type.String(),
  }),
]);

export const WeekdayPaginated = CommonSchemas.Bodies.PaginationResult(Weekday);
