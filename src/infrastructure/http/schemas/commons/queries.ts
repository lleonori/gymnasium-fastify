import { Type } from "typebox";

export const Pagination = Type.Object({
  offset: Type.Number({ default: 0 }),
  limit: Type.Number({ default: 10 }),
});
