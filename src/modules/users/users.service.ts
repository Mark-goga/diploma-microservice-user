import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, User, Users } from '@proto/user/user';

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'goga@gmail.com',
      role: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  create(createUserDto: CreateUserDto): User {
    const user: User = {
      ...createUserDto,
      id: 'jskdhgfdjsh',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.push(user);
    return user;
  }

  findAll(): Users {
    return { users: this.users };
  }

  findOne(id: string): User {
    return this.users.find((user) => user.id === id);
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto,
    };
    return this.users[userIndex];
  }

  remove(id: string) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.users.splice(userIndex)[0];
  }
}
