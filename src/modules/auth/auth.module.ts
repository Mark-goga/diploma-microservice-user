import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@modules/users/users.module';
import { AuthRepository } from '@modules/auth/auth.repository';
import { AuthGuard } from '@lib/src/guards';
import { join } from 'path';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from '@proto/auth/auth';
import { PROTO_PATH } from '@lib/src';

@Module({
  imports: [
    UsersModule,
    ClientsModule.register([
      {
        name: AUTH_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AUTH_PACKAGE_NAME,
          protoPath: join(__dirname, `../../${PROTO_PATH}/auth/auth.proto`),
          loader: {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
            includeDirs: [join(__dirname, `../../${PROTO_PATH}`)],
          },
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, AuthGuard],
})
export class AuthModule {}
