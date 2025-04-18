import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { PrismaExceptionFilter } from './filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 8000;

  app.useLogger(app.get(Logger));

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalFilters(new PrismaExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('API for managing todo items')
    .setVersion('1.0')
    .addTag('todos')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.setGlobalPrefix('/api', { exclude: ['sse', 'messages'] });
  await app.listen(port).then(() => {
    console.log(`Server is running on port ${port}`);
  });
}

bootstrap();
