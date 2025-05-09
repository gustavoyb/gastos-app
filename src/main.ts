import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no decoradas
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no decoradas
      transform: true, // Transforma los objetos al tipo esperado
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
