import {
  AllowedUserFilterFields,
  AllowedUserSortingFields,
} from '@modules/users/enums';
import { CreateFindManyDtoValidator } from '@lib/src';

export class FindManyUsersValidator extends CreateFindManyDtoValidator(
  AllowedUserSortingFields,
  AllowedUserFilterFields,
) {}
