import { Body, Controller, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserServiceControllerMethods } from '@proto/user/user';
import { CreateUserValidator } from '@modules/users/dto/create-user.dto';
import { UpdateUserValidator } from '@modules/users/dto/update-user.dto';
import { FindOneDocumentValidator } from '@lib/src';
import { FindManyUsersValidator } from '@modules/users/dto/get-users.dto';
import { UserResponseInterceptor } from '@modules/users/users.interceptor';

@Controller()
@UserServiceControllerMethods()
@UseInterceptors(UserResponseInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  createUser(@Body() createUserDto: CreateUserValidator) {
    return this.usersService.create(createUserDto);
  }

  findUsers(@Body() options: FindManyUsersValidator) {
    return this.usersService.findAll(options);
  }

  findOneUser(@Body() findOneUserDto: FindOneDocumentValidator) {
    return this.usersService.findOne(findOneUserDto.id);
  }

  updateUser(@Body() updateUserDto: UpdateUserValidator) {
    return this.usersService.update(updateUserDto);
  }

  deleteUser(@Body() findOneUserDto: FindOneDocumentValidator) {
    return this.usersService.remove(findOneUserDto.id);
  }
}
