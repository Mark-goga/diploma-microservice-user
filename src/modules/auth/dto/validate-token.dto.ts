import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TokenType } from '@proto/auth/auth';

export class ValidateTokenValidator {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @IsEnum(TokenType)
  type: TokenType;
}
