export type CreateCoach = {
  name: string;
  surname: string;
  notes: string;
};

export type UpdateCoach = Partial<CreateCoach>;

export type Coach = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
} & CreateCoach;
