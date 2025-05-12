import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, User, Users } from '@proto/user/user';
import { UsersRepository } from '@modules/users/users.repository';
import { FindManyUsersValidator } from '@modules/users/dto/get-users.dto';
import { PaginationUtil } from '@lib/src';
import { FilterUtil } from '@lib/src/utils/filter-for-prisma.utils';
import { Prisma } from '@prisma/client';
import { FILTER_CONFIG_FOR_USER } from '@modules/users/constants/user-filter.constants';
import { SortForPrismaUtil } from '@lib/src/utils/sort-for-prisma.util';
import { UsersMap } from '@modules/users/users.map';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmailOrThrow(email);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return UsersMap.mapPrismaUserToProtoUser(user);
  }

  async findAll(options: FindManyUsersValidator): Promise<Users> {
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
      users: UsersMap.mapArrPrismaUsersToProtoUsers(users),
      pagination: {
        ...paginationMeta,
      },
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findByIdOrThrow(id);
    return UsersMap.mapPrismaUserToProtoUser(user);
  }

  async update(updateUserDto: UpdateUserDto): Promise<User> {
    const { id, ...data } = updateUserDto;
    const user = await this.userRepository.update(id, data);
    return UsersMap.mapPrismaUserToProtoUser(user);
  }

  async remove(id: string): Promise<User> {
    const user = await this.userRepository.delete(id);
    return UsersMap.mapPrismaUserToProtoUser(user);
  }
}
