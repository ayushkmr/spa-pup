import { Test, TestingModule } from '@nestjs/testing';
import { PuppyController } from './puppy.controller';
import { PuppyService } from './puppy.service';

// Mock PuppyService
const mockPuppyService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  search: jest.fn(),
};

describe('PuppyController', () => {
  let controller: PuppyController;
  let puppyService: PuppyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PuppyController],
      providers: [
        {
          provide: PuppyService,
          useValue: mockPuppyService,
        },
      ],
    }).compile();

    controller = module.get<PuppyController>(PuppyController);
    puppyService = module.get<PuppyService>(PuppyService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
