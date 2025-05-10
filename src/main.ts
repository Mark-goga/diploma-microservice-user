import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import {
  GrpcPrismaExceptionFilter,
  GrpcValidationPipe,
  PROTO_PATH,
} from '@lib/src';
import { USER_PACKAGE_NAME } from '@proto/user/user';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, `${PROTO_PATH}/user/user.proto`),
        package: USER_PACKAGE_NAME,
        loader: {
          includeDirs: [join(__dirname, PROTO_PATH)],
        },
      },
    },
  );

  app.useGlobalFilters(new GrpcPrismaExceptionFilter());

  app.useGlobalPipes(new GrpcValidationPipe());
  await app.listen();
}

bootstrap();
