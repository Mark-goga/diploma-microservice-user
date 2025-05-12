import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import {
  LoginValidator,
  RegisterValidator,
  RemoveSessionsValidator,
} from './dto';
import { UsersService } from '@modules/users/users.service';
import { AuthRepository } from '@modules/auth/auth.repository';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { ERROR_MESSAGES } from '@common/constants/error-messages.constants';
import { DataForSession, SessionUtil } from '@modules/auth/utils/session.util';
import { ValidateTokenValidator } from '@modules/auth/dto/validate-token.dto';
import { UsersMap } from '@modules/users/users.map';
import { Tokens } from '@modules/auth/auth.type';
import { User } from '@proto/user/user';
import { TokenType } from '@proto/auth/auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authRepository: AuthRepository,
  ) {}

  private async validateUserPassword(
    password: string,
    requestPassword: string,
  ) {
    const isValidPassword = await bcrypt.compare(requestPassword, password);
    if (!isValidPassword) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        details: ERROR_MESSAGES.AUTH.INCORRECT_CREDENTIALS,
      });
    }
  }

  private async createSession(data: DataForSession) {
    const sessionData = SessionUtil.createDataForSession(data);
    const session = await this.authRepository.createSession(sessionData);
    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  }

  async login(
    loginDto: LoginValidator,
    ipAddress: string,
    userAgent: string,
  ): Promise<any> {
    const user = await this.usersService.findByEmail(loginDto.email);
    await this.validateUserPassword(user.password, loginDto.password);

    const tokens = await this.createSession({
      userId: user.id,
      userAgent,
      ipAddress,
    });
    return {
      ...tokens,
      user: UsersMap.mapPrismaUserToProtoUser(user),
    };
  }

  async register(
    registerDto: RegisterValidator,
    ipAddress: string,
    userAgent: string,
  ) {
    const user = await this.usersService.create(registerDto);
    const tokens = this.createSession({
      userId: user.id,
      ipAddress,
      userAgent,
    });
    return {
      ...tokens,
      user,
    };
  }

  async refresh(tokens: Tokens) {
    const sessionData = SessionUtil.generateTokens();
    const session = await this.authRepository.updateSession(
      tokens,
      sessionData,
    );
    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      user: UsersMap.mapPrismaUserToProtoUser(session.user),
    };
  }

  async logout(tokens: Tokens) {
    await this.authRepository.deleteSession(tokens);
  }

  async getSessions(user: User) {
    const sessions = await this.authRepository.findSessionsByUserId(user.id);
    return {
      sessions,
    };
  }

  async removeSessions(removeSessionsDto: RemoveSessionsValidator) {
    await this.authRepository.deleteSessionsByIds(removeSessionsDto.ids);
  }

  async validateToken(validateTokenDto: ValidateTokenValidator) {
    const session = await this.authRepository.findSessionByTokenWithUser(
      validateTokenDto.token,
      validateTokenDto.type,
    );
    if (validateTokenDto.type === TokenType.ACCESS) {
      this.checkTokenLife(session.accessTokenExpiresAt);
    } else {
      this.checkTokenLife(session.refreshTokenExpiresAt);
    }
    return { session, user: UsersMap.mapPrismaUserToProtoUser(session.user) };
  }

  private checkTokenLife(expiredAt: Date) {
    if (expiredAt < new Date()) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        details: ERROR_MESSAGES.AUTH.TOKEN_EXPIRED,
      });
    }
  }
}
