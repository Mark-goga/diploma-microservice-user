import { Body, Controller, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthServiceControllerMethods, TokenType } from '@proto/auth/auth';
import {
  LoginValidator,
  RegisterValidator,
  RemoveSessionsValidator,
} from '@modules/auth/dto';
import {
  GetMetadataForSession,
  RequestMetadataForSession,
} from '@modules/auth/decorators/get-session-metadata.decorator';
import { Payload } from '@nestjs/microservices';
import { ValidateTokenValidator } from '@modules/auth/dto/validate-token.dto';
import { AuthGuard } from '@lib/src/guards';
import { getTokensFromMetadata } from '@modules/auth/decorators/get-tokens-metadata.decorator';
import { getCurrentUser, TokenTypeDecorator } from '@lib/src/decorators';
import { User } from '@proto/user/user';
import { Tokens } from '@modules/auth/auth.type';

@Controller()
@AuthServiceControllerMethods()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login(
    @Payload() request: LoginValidator,
    @GetMetadataForSession() metadata: RequestMetadataForSession,
  ) {
    return this.authService.login(
      request,
      metadata.ipAddress,
      metadata.userAgent,
    );
  }

  register(
    @Payload() request: RegisterValidator,
    @GetMetadataForSession() metadata: RequestMetadataForSession,
  ) {
    return this.authService.register(
      request,
      metadata.ipAddress,
      metadata.userAgent,
    );
  }

  @TokenTypeDecorator(TokenType.REFRESH)
  @UseGuards(AuthGuard)
  refresh(@getTokensFromMetadata() metadata: Tokens) {
    return this.authService.refresh(metadata);
  }

  @UseGuards(AuthGuard)
  logout(@getTokensFromMetadata() metadata: Tokens) {
    return this.authService.logout(metadata);
  }

  @UseGuards(AuthGuard)
  getSessions(@getCurrentUser() user: User) {
    return this.authService.getSessions(user);
  }

  @UseGuards(AuthGuard)
  removeSessions(@Body() removeSessionsDto: RemoveSessionsValidator) {
    return this.authService.removeSessions(removeSessionsDto);
  }

  validateToken(@Payload() request: ValidateTokenValidator) {
    return this.authService.validateToken(request);
  }
}
