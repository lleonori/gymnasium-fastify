import { Type } from "@sinclair/typebox";

export const Date = Type.Object({
  date: Type.String({ format: "date" }), // ISO 8601 date format
});
