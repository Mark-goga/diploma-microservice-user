import { TokenUtils } from '@common/utils';
import { ACCESS_TOKEN_LIFE, REFRESH_TOKEN_LIFE } from '@modules/auth/constants';

export type CreateSessionData = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
  userId: string;
  ipAddress: string;
  userAgent: string;
};

export type DataForSession = {
  userId: string;
  ipAddress: string;
  userAgent: string;
};

export class SessionUtil {
  static generateTokens() {
    const accessToken = TokenUtils.createAccessToken();
    const refreshToken = TokenUtils.createRefreshToken();

    const now = new Date();
    const accessTokenExpiresAt = new Date(now);
    accessTokenExpiresAt.setMinutes(now.getMinutes() + ACCESS_TOKEN_LIFE);

    const refreshTokenExpiresAt = new Date(now);
    refreshTokenExpiresAt.setDate(now.getDate() + REFRESH_TOKEN_LIFE);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    };
  }

  static createDataForSession({
    userId,
    ipAddress,
    userAgent,
  }: DataForSession): CreateSessionData {
    const tokens = this.generateTokens();

    return {
      ...tokens,
      userId,
      ipAddress,
      userAgent,
    };
  }
}
