import { Type } from "@sinclair/typebox";
import PaginationSchema from "../commons/index.js";

export const BookingsQuery = Type.Partial(
  Type.Intersect([
    Type.Object({
      mail: Type.String({ format: "email" }),
      day: Type.String({ format: "date" }),
      timetableId: Type.Number(),
      dateFrom: Type.String({ format: "date" }),
      dateTo: Type.String({ format: "date" }),
    }),
    PaginationSchema.Queries.Pagination,
    Type.Object({
      sort: Type.Array(
        Type.Union([
          Type.TemplateLiteral("${id}"),
          Type.TemplateLiteral("${id}.${asc|desc}"),
        ]),
        { default: ["id.asc"] },
      ),
    }),
  ]),
);
