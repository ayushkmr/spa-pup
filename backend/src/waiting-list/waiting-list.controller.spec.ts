import { Test, TestingModule } from '@nestjs/testing';
import { WaitingListController } from './waiting-list.controller';
import { WaitingListService } from './waiting-list.service';

// Mock WaitingListService
const mockWaitingListService = {
  createToday: jest.fn(),
  getToday: jest.fn(),
  addEntry: jest.fn(),
  markServiced: jest.fn(),
  reorderEntries: jest.fn(),
  getByDate: jest.fn(),
  getAll: jest.fn(),
  search: jest.fn(),
};

describe('WaitingListController', () => {
  let controller: WaitingListController;
  let waitingListService: WaitingListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaitingListController],
      providers: [
        {
          provide: WaitingListService,
          useValue: mockWaitingListService,
        },
      ],
    }).compile();

    controller = module.get<WaitingListController>(WaitingListController);
    waitingListService = module.get<WaitingListService>(WaitingListService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
