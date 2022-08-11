/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const logLevels: LogLevel[] = ['error', 'warn'];

if (!environment.production) {
  logLevels.push('log');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Add Swagger only in development mode
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('ArmoniK API')
      .setDescription(
        'ArmoniK is a high performance computing cluster. This API is the bridge between the administration interface and the cluster.'
      )
      .setVersion('0.0.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/_swagger', app, document);
  }

  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
