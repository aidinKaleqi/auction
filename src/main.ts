import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { requestId } from './middlewares/requestId.middleware';
import { Logger } from './middlewares/logger.middleware';
import * as bodyParser from 'body-parser';
import { CustomEvent } from 'src/filter/custom.event';
import { Cluster } from './cluster';
dotenv.config();

async function bootstrap() {
  Cluster.clusterize(async () => {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'log'],
    });
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
    app.setGlobalPrefix('api');
    app.use(requestId);
    app.use(Logger);
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        exceptionFactory: (errors) =>
          new CustomEvent('validationError', 400, errors),
      }),
    );
    await app.listen(Number(process.env.SERVICE_PORT), process.env.SERVICE_IP);
  });
}
bootstrap();
