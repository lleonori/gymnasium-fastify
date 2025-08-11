import { NotFoundException } from "../commons/exceptions.js";
import { PaginatedResult, Pagination, SortBy } from "../commons/models.js";
import { CreateCoach, Coach, UpdateCoach } from "./models.js";
import { ICoachRepository } from "./coachRepository.js";

export class CoachService {
  constructor(protected readonly coachRepository: ICoachRepository) {}

  create(coach: CreateCoach): Promise<Coach> {
    return this.coachRepository.create(coach);
  }

  findAll(
    pagination: Pagination,
    sortBy: SortBy<Coach>,
  ): Promise<PaginatedResult<Coach>> {
    return this.coachRepository.findAll(pagination, sortBy);
  }

  async findById(id: Coach["id"]): Promise<Coach> {
    const coach = await this.coachRepository.findById(id);
    this.handleNotFound(coach, id);
    return coach;
  }

  async update(id: Coach["id"], coach: UpdateCoach): Promise<Coach> {
    const updatedCoach = await this.coachRepository.update(id, coach);
    this.handleNotFound(updatedCoach, id);
    return updatedCoach;
  }

  async delete(id: Coach["id"]): Promise<Coach> {
    const deletedCoach = await this.coachRepository.delete(id);
    this.handleNotFound(deletedCoach, id);
    return deletedCoach;
  }

  private handleNotFound(
    coach: Coach | undefined,
    id: Coach["id"],
  ): asserts coach is Coach {
    if (!coach) throw new NotFoundException(`Coach con id ${id} non trovato`);
  }
}
