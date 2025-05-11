import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '@proto/user/user';
import { UsersRepository } from '@modules/users/users.repository';
import { FindManyUsersValidator } from '@modules/users/dto/get-users.dto';
import { PaginationUtil } from '@lib/src';
import { FilterUtil } from '@lib/src/utils/filter-for-prisma.utils';
import { Prisma } from '@prisma/client';
import { FILTER_CONFIG_FOR_USER } from '@modules/users/constants/user-filter.constants';
import { SortForPrismaUtil } from '@lib/src/utils/sort-for-prisma.util';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmailOrThrow(email);
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    return this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll(options: FindManyUsersValidator) {
    const pagination = PaginationUtil.getSkipAndLimit({
      ...options.pagination,
    });

    const where = FilterUtil.buildPrismaWhere<Prisma.UsersWhereInput>(
      options.filters,
      FILTER_CONFIG_FOR_USER,
    );

    const sort =
      SortForPrismaUtil.sortForPrisma<Prisma.UsersOrderByWithRelationInput>(
        options.sorting,
      );

    const [users, total] = await Promise.all([
      this.userRepository.findMany(pagination, where, sort),
      this.userRepository.count(where),
    ]);

    const paginationMeta = PaginationUtil.getMeta(
      options.pagination.page,
      pagination.limit,
      total,
    );

    return {
      users,
      pagination: {
        ...paginationMeta,
      },
    };
  }

  async findOne(id: string) {
    return this.userRepository.findByIdOrThrow(id);
  }

  async update(updateUserDto: UpdateUserDto) {
    const { id, ...data } = updateUserDto;
    return this.userRepository.update(id, data);
  }

  async remove(id: string) {
    return this.userRepository.delete(id);
  }
}
