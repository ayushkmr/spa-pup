import { Test, TestingModule } from '@nestjs/testing';
import { WaitingListService } from './waiting-list.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { format } from 'date-fns';

// Mock PrismaService
const mockPrismaService = {
  waitingList: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn(),
    findMany: jest.fn(),
  },
  waitingListEntry: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    aggregate: jest.fn(),
  },
  puppy: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  $transaction: jest.fn((updates) => Promise.resolve(updates)),
};

describe('WaitingListService', () => {
  let service: WaitingListService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WaitingListService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<WaitingListService>(WaitingListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTodayList', () => {
    it('should create a new waiting list for today if one does not exist', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Mock the upsert operation
      const mockCreatedList = {
        id: 1,
        date: today,
      };
      mockPrismaService.waitingList.upsert.mockResolvedValueOnce(mockCreatedList);

      const result = await service.createTodayList();

      expect(mockPrismaService.waitingList.upsert).toHaveBeenCalledWith({
        where: { date: today },
        update: {},
        create: { date: today },
      });

      expect(result).toEqual(mockCreatedList);
    });
  });

  describe('getTodayList', () => {
    it('should return the waiting list for today with entries', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Mock the waiting list with entries
      const mockWaitingList = {
        id: 1,
        date: today,
        entries: [
          {
            id: 1,
            position: 1,
            puppyId: 1,
            serviceRequired: 'Bath & Dry',
            arrivalTime: new Date(),
            serviced: false,
            puppy: {
              id: 1,
              name: 'Max',
              ownerName: 'John Doe',
            },
          },
        ],
      };

      mockPrismaService.waitingList.findUnique.mockResolvedValueOnce(mockWaitingList);

      const result = await service.getTodayList();

      expect(mockPrismaService.waitingList.findUnique).toHaveBeenCalledWith({
        where: { date: today },
        include: {
          entries: {
            orderBy: { position: 'asc' },
            include: { puppy: true },
          },
        },
      });

      expect(result).toEqual(mockWaitingList);
    });
  });

  describe('addEntryToTodayList', () => {
    it('should add a new entry to the waiting list', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Mock the waiting list
      const mockWaitingList = {
        id: 1,
        date: today,
      };

      // Mock the aggregate result for max position
      const mockMaxPosition = {
        _max: { position: 2 },
      };

      // Mock the created entry
      const mockCreatedEntry = {
        id: 3,
        position: 3,
        puppyId: 1,
        waitingListId: 1,
        serviceRequired: 'Bath & Dry',
        arrivalTime: expect.any(Date),
        serviced: false,
      };

      mockPrismaService.waitingList.findUnique.mockResolvedValueOnce(mockWaitingList);
      mockPrismaService.waitingListEntry.aggregate.mockResolvedValueOnce(mockMaxPosition);
      mockPrismaService.waitingListEntry.create.mockResolvedValueOnce(mockCreatedEntry);

      const result = await service.addEntryToTodayList(1, 'Bath & Dry');

      expect(mockPrismaService.waitingList.findUnique).toHaveBeenCalledWith({
        where: { date: today },
      });
      expect(mockPrismaService.waitingListEntry.aggregate).toHaveBeenCalledWith({
        where: { waitingListId: 1 },
        _max: { position: true },
      });
      expect(mockPrismaService.waitingListEntry.create).toHaveBeenCalledWith({
        data: {
          puppyId: 1,
          waitingListId: 1,
          serviceRequired: 'Bath & Dry',
          position: 3,
          arrivalTime: expect.any(Date),
        },
      });

      expect(result).toEqual(mockCreatedEntry);
    });
  });

  describe('markEntryServiced', () => {
    it('should mark an entry as serviced', async () => {
      // Mock the updated entry
      const mockUpdatedEntry = {
        id: 1,
        position: 1,
        puppyId: 1,
        waitingListId: 1,
        serviceRequired: 'Bath & Dry',
        arrivalTime: new Date(),
        serviced: true,
      };

      mockPrismaService.waitingListEntry.update.mockResolvedValueOnce(mockUpdatedEntry);

      const result = await service.markEntryServiced(1);

      expect(mockPrismaService.waitingListEntry.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          serviced: true,
          serviceTime: expect.any(Date),
        },
      });

      expect(result).toEqual(mockUpdatedEntry);
    });
  });

  describe('reorderEntries', () => {
    it('should reorder entries based on the provided order', async () => {
      // Mock entries
      const mockEntries = [
        { id: 1, position: 1 },
        { id: 2, position: 2 },
      ];

      // Mock updated entries
      const mockUpdatedEntries = [
        { id: 2, position: 1 },
        { id: 1, position: 2 },
      ];

      mockPrismaService.waitingListEntry.findUnique.mockImplementation((args) => {
        const id = args.where.id;
        return Promise.resolve(mockEntries.find(entry => entry.id === id));
      });

      mockPrismaService.waitingListEntry.update.mockImplementation((args) => {
        const id = args.where.id;
        const position = args.data.position;
        const updatedEntry = { id, position };
        return Promise.resolve(updatedEntry);
      });

      await service.reorderEntries([2, 1]);

      // Check that update was called for each entry with the correct position
      expect(mockPrismaService.waitingListEntry.update).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.waitingListEntry.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: { position: 1 },
      });
      expect(mockPrismaService.waitingListEntry.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { position: 2 },
      });
    });

    it('should reorder entries successfully', async () => {
      const mockUpdates = [
        { id: 1, position: 2 },
        { id: 2, position: 1 },
      ];

      mockPrismaService.$transaction.mockResolvedValueOnce(mockUpdates);

      const result = await service.reorderEntries([2, 1]);

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(result).toEqual(mockUpdates);
    });
  });
});
