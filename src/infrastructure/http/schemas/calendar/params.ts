import { Type } from "typebox";

export const Mail = Type.Object({
  mail: Type.String({ format: "email" }),
});
