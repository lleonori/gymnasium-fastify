import { Type } from "@sinclair/typebox";
import CommonSchemas from "../commons/index.js";

export const Weekdays = Type.Intersect([
  Type.Object({
    id: Type.Number(),
    name: Type.String(),
  }),
]);

export const WeekdaysPaginated =
  CommonSchemas.Bodies.PaginationResult(Weekdays);
