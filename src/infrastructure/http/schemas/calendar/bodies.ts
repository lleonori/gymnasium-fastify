import { Type } from "@sinclair/typebox";

export const Calendar = Type.Object({
  today: Type.String({ format: "date-time" }),
  tomorrow: Type.String({ format: "date-time" }),
});
