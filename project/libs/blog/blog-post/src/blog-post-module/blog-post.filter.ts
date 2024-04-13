import { Prisma } from "@prisma/client";

export interface PostFilter {
  id?: string;
  title?: string;
}

export const MAX_POST_LIMIT = 20;

export function postFilterToPrismaFilter(filter: PostFilter): Prisma.PostWhereInput | undefined {
  if (!filter) {
    return undefined;
  }

  let prismaFilter: Prisma.PostWhereInput = {};

  if (filter.title) {
    prismaFilter = { title: filter.title };
  }

  return prismaFilter;
}
