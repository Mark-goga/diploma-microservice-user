import * as crypto from 'crypto';

export class TokenUtils {
  static createToken(length = 64): string {
    const timestamp = Date.now().toString(36);
    const randomBytes = crypto.randomBytes(length).toString('base64url');
    const uuid = crypto.randomUUID().replace(/-/g, '');

    const combinedToken = `${timestamp}.${randomBytes}.${uuid}`;

    return combinedToken.slice(0, length);
  }

  static createRefreshToken(): string {
    return this.createToken(96);
  }

  static createAccessToken(): string {
    return this.createToken();
  }
}
