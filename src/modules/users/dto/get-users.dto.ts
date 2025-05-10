import { FindManyDto, SortDirection } from '@proto/common/common';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AllowedUserFilterFields,
  AllowedUserSortingFields,
} from '@modules/users/enums';

class PaginationDtoValidator {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  page: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @Max(50)
  limit: number;
}

class SortingDtoValidator {
  @IsEnum(AllowedUserSortingFields)
  @IsNotEmpty()
  field: string;

  @IsEnum(SortDirection)
  @IsNotEmpty()
  direction: number;
}

class FilterDtoValidator {
  @IsEnum(AllowedUserFilterFields)
  field: string;

  @IsString()
  value: string;
}

export class FindManyUsersValidator implements FindManyDto {
  @ValidateNested()
  @Type(() => PaginationDtoValidator)
  @IsNotEmpty()
  pagination: PaginationDtoValidator;

  @ValidateNested()
  @Type(() => SortingDtoValidator)
  sorting: SortingDtoValidator;

  @ValidateNested({ each: true })
  @Type(() => FilterDtoValidator)
  filters: FilterDtoValidator[];
}
