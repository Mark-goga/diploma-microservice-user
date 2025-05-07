import { UpdateUserDto } from '@proto/user/user';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';
import { BaseUserDto } from '@modules/users/dto/base-user.dto';

export class UpdateUserValidator
  extends PickType(BaseUserDto, ['name', 'email'] as const)
  implements UpdateUserDto
{
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
