import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { AUTH_PACKAGE_NAME, PROTO_PATH } from '@lib/common/src';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, `${PROTO_PATH}/user/user.proto`),
        package: AUTH_PACKAGE_NAME,
      },
    },
  );
  await app.listen();
}

bootstrap();
