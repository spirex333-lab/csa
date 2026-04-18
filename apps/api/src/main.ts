import { Logger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { JwtService } from '@nestjs/jwt';
import { ApiKeyGuard } from '@workspace/auth/lib/api-key.guard';
import { ApiKeyService } from '@workspace/auth/lib/api-key.service';
import { AuthGuard } from '@workspace/auth/lib/auth.guard';
import { UsersService } from '@workspace/auth/lib/user.service';
import { TenantMembershipService } from '@workspace/auth/lib/tenant-membership.service';
import {
  CustomValidationPipe,
  ENV_API_PREFIX,
  ENV_CORS,
  ENV_HOST,
  ENV_PORT,
  HttpExceptionFilter,
  HttpValidationFilter,
  QueryParserPipe,
} from '@workspace/be-commons';
import { config } from 'dotenv';
import { AppModule } from './app/app.module';
import {
  KafkaOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
config();
console.log('env variables:', JSON.stringify(process.env, null, 2));

const msgQueueProvider = Transport.KAFKA;
const msgQueueServerUrl = process.env['MSGQ_SERVER_URL'] ?? 'localhost:9092';
const msgQueueClientID = process.env['MSGQ_CLIENT_ID'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = process?.env?.[ENV_API_PREFIX];
  if (globalPrefix) {
    app.setGlobalPrefix(globalPrefix);
  }

  app.useGlobalGuards(
    new ApiKeyGuard(
      app.get(JwtService),
      app.get(ApiKeyService),
      app.get(UsersService),
      app.get(TenantMembershipService)
    ),
    new AuthGuard(
      app.get(JwtService),
      app.get(UsersService),
      app.get(TenantMembershipService),
      app.get(Reflector)
    )
  );
  // ensure app doesn't receive invalid data
  app.useGlobalPipes(
    new CustomValidationPipe({ transform: true }),
    new QueryParserPipe()
  );
  // handle custom  validation exceptions
  app.useGlobalFilters(new HttpValidationFilter(), new HttpExceptionFilter());

  const host = process.env[ENV_HOST] || 'localhost';
  const port = process.env[ENV_PORT] || 3000;
  const cors = process?.env[ENV_CORS]
    ? JSON.parse(process?.env[ENV_CORS])
    : ['*'];
  app.enableCors({
    origin: cors,
  });

  if (msgQueueProvider && msgQueueClientID?.length) {
    app.connectMicroservice<KafkaOptions>({
      transport: msgQueueProvider,
      options: {
        client: {
          brokers: [msgQueueServerUrl],
          clientId: msgQueueClientID,
        },
        consumer: {
          groupId: msgQueueClientID + '-consumer',
        },
        producer: { allowAutoTopicCreation: true },
      },
    });
    app.startAllMicroservices().then(() => {
      Logger.log(`Started kafka microservice at ${msgQueueServerUrl}`);
    });
  }

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://${host}:${port}/${globalPrefix}`
  );
}

bootstrap();
