import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { SkipAndLimit } from '@lib/src';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly omitPassword = { omit: { password: true } };

  async create(data: Prisma.UsersCreateInput) {
    return this.prismaService.users.create({
      ...this.omitPassword,
      data,
    });
  }

  async findMany(
    paginationOptions: SkipAndLimit,
    where?: Prisma.UsersWhereInput,
    sort?: Prisma.UsersOrderByWithRelationInput,
  ) {
    return this.prismaService.users.findMany({
      ...this.omitPassword,
      take: paginationOptions.limit,
      skip: paginationOptions.skip,
      where,
      orderBy: sort,
    });
  }

  async count(where?: Prisma.UsersWhereInput) {
    return this.prismaService.users.count({
      where,
    });
  }

  async findByIdOrThrow(id: string) {
    return this.prismaService.users.findUniqueOrThrow({
      ...this.omitPassword,
      where: {
        id,
      },
    });
  }

  async findByEmailOrThrow(email: string) {
    return this.prismaService.users.findUniqueOrThrow({
      where: {
        email,
      },
    });
  }

  async update(id: string, data: Prisma.UsersUpdateInput) {
    return this.prismaService.users.update({
      ...this.omitPassword,
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prismaService.users.delete({
      ...this.omitPassword,
      where: { id },
    });
  }
}
