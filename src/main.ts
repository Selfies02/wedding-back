import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  // Servir archivos estáticos desde la carpeta 'uploads'
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(3000);
}
bootstrap();
