import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable, Subject } from 'rxjs';
import { CreateUserDto, PaginationDto, UpdateUserDto, User, Users } from '@lib/common/src';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly users: User[] = [];

  onModuleInit() {
    for (let i = 0; i < 10; i++) {
      this.create({ name: randomUUID(), email: randomUUID() });
    }
  }

  create(createUserDto: CreateUserDto): User {
    const user: User = {
      ...createUserDto,
      id: randomUUID(),
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

  queryUser(paginationDtoStream: Observable<PaginationDto>): Observable<Users> {
    const subject = new Subject<Users>();
    const onNext = (pagination: PaginationDto) => {
      const start = pagination.page * pagination.skip;
      subject.next({
        users: this.users.slice(start, start + pagination.skip),
      });
    };
    const onComplete = () => subject.complete();
    paginationDtoStream.subscribe({ next: onNext, complete: onComplete });
    return subject.asObservable();
  }
}
