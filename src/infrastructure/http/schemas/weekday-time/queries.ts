import { Type } from "@sinclair/typebox";
import PaginationSchema from "../commons/index.js";

export const WeekdayTimeQuery = Type.Partial(
  Type.Intersect([
    Type.Object({
      weekdayId: Type.Number(),
    }),
    PaginationSchema.Queries.Pagination,
    Type.Object({
      sort: Type.Array(
        Type.Union([
          Type.TemplateLiteral("${weekdayId}"),
          Type.TemplateLiteral("${weekdayId}.${asc|desc}"),
        ]),
        { default: ["weekdayId.asc"] },
      ),
    }),
  ]),
);
