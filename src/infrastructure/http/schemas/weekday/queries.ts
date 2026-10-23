import { Type } from "typebox";
import PaginationSchema from "../commons/index.js";

export const WeekdayQuery = Type.Partial(
  Type.Intersect([
    PaginationSchema.Queries.Pagination,
    Type.Object({
      sort: Type.Array(
        Type.Union([
          Type.Literal("id"),
          Type.TemplateLiteral("id.${'asc' | 'desc'}"),
        ]),
        { default: ["id.asc"] },
      ),
    }),
  ]),
);
