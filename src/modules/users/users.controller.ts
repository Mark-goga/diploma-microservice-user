import { Body, Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UserServiceController,
  UserServiceControllerMethods,
} from '@proto/user/user';
import { CreateUserValidator } from '@modules/users/dto/create-user.dto';
import { UpdateUserValidator } from '@modules/users/dto/update-user.dto';
import { FindOneDocumentValidator } from '@lib/src';
import { FindManyUsersValidator } from '@modules/users/dto/get-users.dto';

@Controller()
@UserServiceControllerMethods()
export class UsersController implements UserServiceController {
  constructor(private readonly usersService: UsersService) {}

  createUser(@Body() createUserDto: CreateUserValidator) {
    return this.usersService.create(createUserDto);
  }

  findUsers(@Body() findManyUsersDto: FindManyUsersValidator) {
    console.log('findManyUsersDto', findManyUsersDto);
    return this.usersService.findAll();
  }

  findOneUser(@Body() findOneUserDto: FindOneDocumentValidator) {
    return this.usersService.findOne(findOneUserDto.id);
  }

  updateUser(@Body() updateUserDto: UpdateUserValidator) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  deleteUser(@Body() findOneUserDto: FindOneDocumentValidator) {
    return this.usersService.remove(findOneUserDto.id);
  }
}
