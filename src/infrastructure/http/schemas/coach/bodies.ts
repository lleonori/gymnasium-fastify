import { Type } from "@sinclair/typebox";
import CommonSchemas from "../commons/index.js";

export const CreateCoach = Type.Object({
  name: Type.String(),
  surname: Type.String(),
  notes: Type.String(),
});

export const UpdateCoach = Type.Partial(CreateCoach);

export const Coach = Type.Intersect([
  Type.Object({
    id: Type.Number(),
  }),
  CreateCoach,
]);

export const CoachsPaginated = CommonSchemas.Bodies.PaginationResult(Coach);
