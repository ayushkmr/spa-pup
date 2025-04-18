import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  const corsOrigins = process.env.CORS_ORIGINS ?
    process.env.CORS_ORIGINS.split(',') :
    ['http://localhost:3001', 'http://localhost:3000', 'http://frontend:3000', 'https://pup-spa.germanywestcentral.cloudapp.azure.com'];

  console.log('CORS origins:', corsOrigins);

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
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

  const port = process.env.PORT || 3005;

  await app.listen(port, '0.0.0.0');
  const address = await app.getUrl();
  console.log(`Application is running on: ${address}`);
}

bootstrap();
