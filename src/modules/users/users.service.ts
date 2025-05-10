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

  async create(createUserDto: CreateUserDto) {
    // const newUser = await this.userRepository.create(createUserDto);
    // return UsersMap.mapPrismaUserToProtoUser(newUser);
    return this.userRepository.create(createUserDto);
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

    // return {
    //   users: UsersMap.mapArrPrismaUsersToProtoUsers(users),
    //   pagination: { ...paginationMeta },
    // };

    return {
      users,
      pagination: {
        ...paginationMeta,
      },
    };
  }

  async findOne(id: string) {
    // const user = await this.userRepository.findByIdOrThrow(id);
    // return UsersMap.mapPrismaUserToProtoUser(user);
    return this.userRepository.findByIdOrThrow(id);
  }

  async update(updateUserDto: UpdateUserDto) {
    const { id, ...data } = updateUserDto;
    // const user = await this.userRepository.update(id, data);
    // return UsersMap.mapPrismaUserToProtoUser(user);
    return this.userRepository.update(id, data);
  }

  async remove(id: string) {
    // const user = await this.userRepository.delete(id);
    // return UsersMap.mapPrismaUserToProtoUser(user);
    return this.userRepository.delete(id);
  }
}
