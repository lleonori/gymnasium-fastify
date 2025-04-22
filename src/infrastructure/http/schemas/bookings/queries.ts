import { Type } from "@sinclair/typebox";
import PaginationSchema from "../commons/index.js";

export const BookingsQuery = Type.Partial(
  Type.Intersect([
    Type.Object({
      day: Type.String(),
      hour: Type.String({ format: "time" }),
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
