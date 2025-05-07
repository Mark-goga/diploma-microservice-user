import { FindManyDto } from '@proto/common/common';
import {
  ArrayNotEmpty,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

enum AllowedUserFilterFields {
  name = 'name',
  email = 'email',
  role = 'role',
}

class PaginationDtoValidator {
  page: number;
  skip: number;
}

class SortingDtoValidator {
  field: string;
  direction: number;
}

class FilterDtoValidator {
  @IsEnum(AllowedUserFilterFields, {
    message: 'Invalid filter field. Allowed fields are: name, email, role',
  })
  field: string;

  @IsString()
  value: string;
}

export class FindManyUsersValidator implements FindManyDto {
  @ValidateNested()
  @Type(() => PaginationDtoValidator)
  pagination: PaginationDtoValidator;

  @ValidateNested()
  @Type(() => SortingDtoValidator)
  sorting: SortingDtoValidator;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FilterDtoValidator)
  filters: FilterDtoValidator[];
}
