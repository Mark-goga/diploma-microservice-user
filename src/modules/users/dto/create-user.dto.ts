import { PickType } from '@nestjs/mapped-types';
import { BaseUserDto } from '@modules/users/dto/base-user.dto';
import { CreateUserDto } from '@proto/user/user';

export class CreateUserValidator
  extends PickType(BaseUserDto, ['name', 'email', 'password'] as const)
  implements CreateUserDto {}
