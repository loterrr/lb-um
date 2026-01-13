import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable CORS (Allow Frontend to talk to Backend)
  app.enableCors({
    origin: 'http://localhost:3001', // Allow your Next.js app
    credentials: true,
  });

  // 2. Validation (Already added previously)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  await app.listen(3000);
}
bootstrap();
