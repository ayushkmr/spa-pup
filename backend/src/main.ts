import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  const port = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : 3001;

  await app.listen(port);
  const address = await app.getUrl();
  console.log(`Server running on ${address}`);
}
bootstrap();
