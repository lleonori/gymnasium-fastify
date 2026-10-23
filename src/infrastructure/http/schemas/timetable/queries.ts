import { Type } from "typebox";
import PaginationSchema from "../commons/index.js";

export const TimetablesQuery = Type.Partial(
  Type.Intersect([
    Type.Object({
      weekdayId: Type.Number(),
    }),
    PaginationSchema.Queries.Pagination,
    Type.Object({
      sort: Type.Array(
        Type.Union([
          Type.Literal("id"),
          Type.TemplateLiteral("id.${'asc' | 'desc'}"),
          Type.Literal("startHour"),
          Type.TemplateLiteral("startHour.${'asc' | 'desc'}"),
        ]),
        { default: ["startHour.asc"] },
      ),
    }),
  ]),
);
