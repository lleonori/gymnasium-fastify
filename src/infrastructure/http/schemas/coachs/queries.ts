import { Type } from "@sinclair/typebox";
import PaginationSchema from "../commons/index.js";

export const CoachsQuery = Type.Partial(
  Type.Intersect([
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
