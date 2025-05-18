import { Type } from "@sinclair/typebox";
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
          Type.TemplateLiteral("${id}"),
          Type.TemplateLiteral("${id}.${asc|desc}"),
          Type.TemplateLiteral("${startHour}"),
          Type.TemplateLiteral("${startHour}.${asc|desc}"),
        ]),
        { default: ["id.asc"] },
      ),
    }),
  ]),
);
