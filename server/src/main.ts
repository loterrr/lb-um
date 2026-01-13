import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable Validation (for your DTOs)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // 2. Enable CORS (So your Vercel frontend can talk to this backend)
  app.enableCors(); 

  // 3. THE FIX: Use the system port OR 3000
  // Render automatically sets 'PORT', so this is required.
  const port = process.env.PORT || 3000;
  
  // 4. Listen on 0.0.0.0 (Required for Render/Cloud hosting)
  await app.listen(port, '0.0.0.0');
  
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
