import { Kysely, SelectExpression } from "kysely";
import { DB } from "kysely-codegen";
import {
  PaginatedResult,
  Pagination,
  SortBy,
} from "../../application/commons/models.js";
import {
  CreateCoach,
  ICoachRepository,
  Coach,
  UpdateCoach,
} from "../../application/coach/index.js";
import { buildSortBy } from "./utils.js";

export class CoachDao implements ICoachRepository {
  protected readonly DEFAULT_SELECT_FIELDS = [
    "id",
    "name",
    "surname",
    "notes",
    "createdAt",
    "updatedAt",
  ] satisfies ReadonlyArray<SelectExpression<DB, "coaches">>;

  constructor(protected readonly db: Kysely<DB>) {}

  create(newCoach: CreateCoach): Promise<Coach> {
    return this.db
      .insertInto("coaches")
      .values(newCoach)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirstOrThrow();
  }

  async findAll(
    pagination: Pagination,
    sortBy: SortBy<Coach>,
  ): Promise<PaginatedResult<Coach>> {
    const countQuery = this.db
      .selectFrom("coaches")
      .select(({ fn }) => [fn.count<number>("id").as("count")])
      .executeTakeFirst();

    const coachesQuery = this.db
      .selectFrom("coaches")
      .orderBy(buildSortBy<"coaches", Coach>(sortBy))
      .limit(pagination.limit)
      .offset(pagination.offset)
      .select(this.DEFAULT_SELECT_FIELDS)
      .execute();

    const [countResult, coachesResult] = await Promise.all([
      countQuery,
      coachesQuery,
    ]);
    return {
      count: countResult?.count ?? 0,
      data: coachesResult,
    };
  }

  findById(id: Coach["id"]): Promise<Coach | undefined> {
    return this.db
      .selectFrom("coaches")
      .where("id", "=", id)
      .select(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }

  update(id: Coach["id"], booking: UpdateCoach): Promise<Coach | undefined> {
    return this.db
      .updateTable("coaches")
      .set(booking)
      .where("id", "=", id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }

  delete(id: Coach["id"]): Promise<Coach | undefined> {
    return this.db
      .deleteFrom("coaches")
      .where("id", "=", id)
      .returning(this.DEFAULT_SELECT_FIELDS)
      .executeTakeFirst();
  }
}
