import { PaginatedResult, Pagination, SortBy } from "../commons/models.ts";
import { CreateCoach, Coach, UpdateCoach } from "./models.ts";

export interface ICoachRepository {
  create(coach: CreateCoach): Promise<Coach>;
  findAll(
    pagination: Pagination,
    sortBy: SortBy<Coach>
  ): Promise<PaginatedResult<Coach>>;
  findById(id: Coach["id"]): Promise<Coach | undefined>;
  update(id: Coach["id"], coach: UpdateCoach): Promise<Coach | undefined>;
  delete(id: Coach["id"]): Promise<Coach | undefined>;
}
