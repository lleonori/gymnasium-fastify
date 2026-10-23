import { Type } from "typebox";

export const Calendar = Type.Object({
  today: Type.String({ format: "date" }),
  tomorrow: Type.String({ format: "date" }),
});
