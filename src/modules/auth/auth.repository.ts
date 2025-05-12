import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma/prisma.service';
import { CreateSessionData } from '@modules/auth/utils/session.util';
import { TokenType } from '@proto/auth/auth';
import { Prisma } from '@prisma/client';
import { Tokens } from '@modules/auth/auth.type';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createSession(data: CreateSessionData) {
    return this.prismaService.session.create({
      data,
    });
  }

  async findSessionByTokenWithUser(token: string, type: TokenType) {
    const tokenField =
      type === TokenType.ACCESS ? 'accessToken' : 'refreshToken';

    return this.prismaService.session.findFirstOrThrow({
      where: {
        [tokenField]: token,
      },
      include: {
        user: true,
      },
    });
  }

  async updateSession(
    { accessToken, refreshToken }: Tokens,
    data: Prisma.SessionUpdateInput,
  ) {
    return this.prismaService.session.update({
      where: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      data,
      include: {
        user: true,
      },
    });
  }

  async deleteSession({ accessToken, refreshToken }: Tokens) {
    return this.prismaService.session.delete({
      where: {
        accessToken,
        refreshToken,
      },
    });
  }

  async findSessionsByUserId(userId: string) {
    return this.prismaService.session.findMany({
      where: {
        userId,
      },
    });
  }

  async deleteSessionsByIds(ids: string[]) {
    return this.prismaService.session.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
