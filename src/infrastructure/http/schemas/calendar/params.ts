import { Type } from "@sinclair/typebox";

export const Mail = Type.Object({
  mail: Type.String({ format: "email" }),
});
