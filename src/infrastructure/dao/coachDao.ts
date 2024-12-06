import { Kysely, SelectExpression } from "kysely";
import { DB } from "kysely-codegen";
import {
  PaginatedResult,
  Pagination,
  SortBy,
} from "../../application/commons/models.ts";
import {
  CreateCoach,
  ICoachRepository,
  Coach,
  UpdateCoach,
} from "../../application/coach/index.ts";
import { buildSortBy } from "./utils.ts";

export class CoachDao implements ICoachRepository {
  protected readonly DEFAULT_SELECT_FIELDS = [
    "id",
    "name",
    "surname",
    "notes",
    "image",
    "created_at as createdAt",
    "updated_at as updatedAt",
  ] satisfies ReadonlyArray<SelectExpression<DB, "coachs">>;

  constructor(protected readonly db: Kysely<DB>) {}

  create(newCoach: CreateCoach): Promise<Coach> {
    return this.db
      .insertInto("coachs")
      .values(newCoach)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirstOrThrow();
  }

  async findAll(
    pagination: Pagination,
    sortBy: SortBy<Coach>,
  ): Promise<PaginatedResult<Coach>> {
    const countQuery = this.db
      .selectFrom("coachs")
      .select(({ fn }) => [fn.count<number>("id").as("count")])
      .executeTakeFirst();

    const coachsQuery = this.db
      .selectFrom("coachs")
      .orderBy(buildSortBy<"coachs", Coach>(sortBy))
      .limit(pagination.limit)
      .offset(pagination.offset)
      .select(this.DEFAULT_SELECT_FIELDS)
      .execute();

    const [countResult, coachsResult] = await Promise.all([
      countQuery,
      coachsQuery,
    ]);
    return {
      count: countResult?.count ?? 0,
      data: coachsResult,
    };
  }

  findById(id: Coach["id"]): Promise<Coach | undefined> {
    return this.db
      .selectFrom("coachs")
      .where("id", "=", id)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }

  update(id: Coach["id"], booking: UpdateCoach): Promise<Coach | undefined> {
    return this.db
      .updateTable("coachs")
      .set(booking)
      .where("id", "=", id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }

  delete(id: Coach["id"]): Promise<Coach | undefined> {
    return this.db
      .deleteFrom("coachs")
      .where("id", "=", id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }
}
