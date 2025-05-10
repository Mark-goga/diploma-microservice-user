import { Role as ProtoRole, User as ProtoUser } from '@proto/user/user';
import { Role as PrismaRole, Users as PrismaUser } from '@prisma/client';
import { DateMapUtils } from '@lib/src';

export class UsersMap {
  static mapProtoRoleToPrismaRole(role: ProtoRole): PrismaRole {
    const roleMap = {
      [ProtoRole.ADMIN]: PrismaRole.ADMIN,
      [ProtoRole.USER]: PrismaRole.USER,
    };
    return roleMap[role];
  }

  static mapPrismaRoleToProtoRole(role: PrismaRole): ProtoRole {
    const roleMap = {
      [PrismaRole.ADMIN]: ProtoRole.ADMIN,
      [PrismaRole.USER]: ProtoRole.USER,
    };
    return roleMap[role];
  }

  static mapPrismaUserToProtoUser(user: PrismaUser): ProtoUser {
    return {
      ...user,
      ...DateMapUtils.mapCreatedUpdatedAtDateToISOString(user),
      role: this.mapPrismaRoleToProtoRole(user.role),
    };
  }

  static mapArrPrismaUsersToProtoUsers(users: PrismaUser[]): ProtoUser[] {
    if (!users || users.length === 0) {
      return [];
    }
    return users.map((user) => this.mapPrismaUserToProtoUser(user));
  }
}
