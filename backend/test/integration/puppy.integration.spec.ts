import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { setupTestApp, cleanupDatabase, createTestClient } from './setup';

describe('Puppy API Integration Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let testClient: any;

  beforeAll(async () => {
    // Set up the test application
    const setup = await setupTestApp();
    app = setup.app;
    prismaService = setup.prismaService;
    testClient = createTestClient(app);
  });

  afterAll(async () => {
    // Clean up and close the application
    await app.close();
  });

  beforeEach(async () => {
    // Clean the database before each test
    await cleanupDatabase(prismaService);
  });

  describe('POST /puppy/create', () => {
    it('should create a new puppy', async () => {
      const puppyData = {
        name: 'Max',
        ownerName: 'John Doe',
      };

      const response = await testClient
        .post('/puppy/create')
        .send(puppyData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(puppyData.name);
      expect(response.body.ownerName).toBe(puppyData.ownerName);
      // No additional fields to check

      // Verify the puppy was created in the database
      const createdPuppy = await prismaService.puppy.findFirst({
        where: {
          name: puppyData.name,
          ownerName: puppyData.ownerName
        },
      });

      expect(createdPuppy).not.toBeNull();
      expect(createdPuppy?.name).toBe(puppyData.name);
    });

    it('should return 400 for invalid puppy data', async () => {
      const invalidPuppyData = {
        // Missing required fields
        breed: 'Golden Retriever',
      };

      await testClient
        .post('/puppy/create')
        .send(invalidPuppyData)
        .expect(400);
    });
  });

  describe('GET /puppy/search', () => {
    beforeEach(async () => {
      // Create test puppies
      await prismaService.puppy.createMany({
        data: [
          {
            name: 'Max',
            ownerName: 'John Doe',
          },
          {
            name: 'Bella',
            ownerName: 'Jane Smith',
          },
          {
            name: 'Charlie',
            ownerName: 'John Doe',
          },
        ],
      });
    });

    it('should search puppies by name', async () => {
      const response = await testClient
        .get('/puppy/search?q=Max')
        .expect(200);

      // There might be multiple puppies with the same name
      expect(response.body.length).toBeGreaterThan(0);
      // Check that all returned puppies have the name 'Max'
      response.body.forEach((puppy: any) => {
        expect(puppy.name).toBe('Max');
      });
    });

    it('should search puppies by owner name', async () => {
      const response = await testClient
        .get('/puppy/search?q=John')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body.map((p: any) => p.ownerName)).toEqual([
        'John Doe',
        'John Doe',
      ]);
    });

    it('should return empty array for no matches', async () => {
      const response = await testClient
        .get('/puppy/search?q=NonExistent')
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /puppy/all', () => {
    beforeEach(async () => {
      // Create test puppies
      await prismaService.puppy.createMany({
        data: [
          {
            name: 'Max',
            ownerName: 'John Doe',
          },
          {
            name: 'Bella',
            ownerName: 'Jane Smith',
          },
        ],
      });
    });

    it('should return all puppies', async () => {
      const response = await testClient.get('/puppy/all').expect(200);

      // There might be more puppies in the database from previous tests
      expect(response.body.length).toBeGreaterThanOrEqual(2);

      // Check that the puppies we created are included in the response
      const names = response.body.map((p: any) => p.name);
      expect(names).toContain('Bella');
      expect(names).toContain('Max');
    });
  });
});
