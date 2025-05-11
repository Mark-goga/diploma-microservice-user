import { createParamDecorator } from '@nestjs/common';
import { GetTokensUtil } from '@lib/src';

export const getTokensFromMetadata = createParamDecorator(
  (_: unknown, context: any) => {
    const accessToken = GetTokensUtil.getTokenFromMetadata(context);
    const refreshToken = GetTokensUtil.getRefreshTokenFromMetadata(context);
    return { accessToken, refreshToken };
  },
);
