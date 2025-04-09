import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as request from 'supertest';

export async function setupTestApp(): Promise<{
  app: INestApplication;
  prismaService: PrismaService;
}> {
  // Create a testing module with the AppModule
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  // Create a NestJS application from the testing module
  const app = moduleFixture.createNestApplication();
  
  // Apply the same pipes and middleware as the main application
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // Enable CORS for frontend
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Initialize the application
  await app.init();

  // Get the PrismaService from the application
  const prismaService = app.get<PrismaService>(PrismaService);

  return { app, prismaService };
}

export async function cleanupDatabase(prismaService: PrismaService): Promise<void> {
  // Clean up the database after tests
  // Delete in the correct order to respect foreign key constraints
  await prismaService.waitingListEntry.deleteMany({});
  await prismaService.waitingList.deleteMany({});
  await prismaService.puppy.deleteMany({});
}

export function getHttpServer(app: INestApplication) {
  return app.getHttpServer();
}

export function createTestClient(app: INestApplication) {
  return request(getHttpServer(app));
}
