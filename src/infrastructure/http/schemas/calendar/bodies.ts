import { Type } from "@sinclair/typebox";

export const Calendar = Type.Object({
  today: Type.String(),
  tomorrow: Type.String(),
});
