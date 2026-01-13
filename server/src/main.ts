import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // 2. Enable CORS (Crucial for your Vercel frontend to connect later)
  app.enableCors(); 

  // 3. THE FIX: Use the system port provided by Render
  // If process.env.PORT is missing, default to 3000 (for local development)
  const port = process.env.PORT || 3000;
  
  // 4. IMPORTANT: Listen on '0.0.0.0'
  // If you don't add '0.0.0.0', Render cannot see your app.
  await app.listen(port, '0.0.0.0');
  
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
