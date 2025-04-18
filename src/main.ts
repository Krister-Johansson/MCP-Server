import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
-    .setTitle('Cats example')
-    .setDescription('The cats API description')
+    .setTitle('Todo API')
+    .setDescription('API for managing todo items')
     .setVersion('1.0')
-    .addTag('cats')
+    .addTag('todos')
     .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.setGlobalPrefix('/api', { exclude: ['sse', 'messages'] });
  await app.listen(process.env.PORT ?? 8000);
}

bootstrap();
