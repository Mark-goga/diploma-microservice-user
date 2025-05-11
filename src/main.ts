import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import {
  ExceptionFilter,
  GrpcPrismaExceptionFilter,
  GrpcValidationPipe,
  PROTO_PATH,
} from '@lib/src';
import { USER_PACKAGE_NAME } from '@proto/user/user';
import { AUTH_PACKAGE_NAME } from '@proto/auth/auth';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: [
          join(__dirname, `${PROTO_PATH}/user/user.proto`),
          join(__dirname, `${PROTO_PATH}/auth/auth.proto`),
        ],
        package: [USER_PACKAGE_NAME, AUTH_PACKAGE_NAME],
        loader: {
          includeDirs: [join(__dirname, PROTO_PATH)],
        },
      },
    },
  );

  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new ExceptionFilter());
  app.useGlobalFilters(new GrpcPrismaExceptionFilter());

  app.useGlobalPipes(new GrpcValidationPipe());
  await app.listen();
}

bootstrap();
