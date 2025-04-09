import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: true, // Allow all origins in development
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Add global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      transform: true, // Transform payloads to DTO instances
      forbidNonWhitelisted: true, // Throw errors if non-whitelisted properties are present
      transformOptions: {
        enableImplicitConversion: true, // Automatically convert primitives
      },
    }),
  );

  const port = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : 3005;

  await app.listen(port, '0.0.0.0');
  const address = await app.getUrl();
  console.log(`Server running on ${address}`);
  console.log(`Server also available at http://localhost:${port}`);
}
bootstrap();
