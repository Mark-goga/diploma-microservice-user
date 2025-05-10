import { FilterConfig } from '@lib/src';
import { AllowedUserFilterFields } from '@modules/users/enums';

export const FILTER_CONFIG_FOR_USER: FilterConfig = {
  [AllowedUserFilterFields.name]: {
    transform: (value: string) => ({
      contains: value,
      mode: 'insensitive',
    }),
  },
  [AllowedUserFilterFields.email]: {
    transform: (value: string) => ({
      contains: value,
      mode: 'insensitive',
    }),
  },
  [AllowedUserFilterFields.role]: {
    transform: (value: string) => ({
      equals: value,
    }),
  },
};
