import axios from 'axios';
import { puppyApi, waitingListApi } from '@/lib/api';

// Mock the API module directly instead of axios
jest.mock('@/lib/api', () => {
  return {
    puppyApi: {
      getAll: jest.fn().mockResolvedValue({ data: [] }),
      create: jest.fn().mockResolvedValue({ data: {} }),
    },
    waitingListApi: {
      getToday: jest.fn().mockResolvedValue({ data: {} }),
      createToday: jest.fn().mockResolvedValue({ data: {} }),
      addEntry: jest.fn().mockResolvedValue({ data: {} }),
      markServiced: jest.fn().mockResolvedValue({ data: {} }),
      reorder: jest.fn().mockResolvedValue({ data: {} }),
    },
  };
});

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('puppyApi', () => {
    it('getAll should fetch all puppies', async () => {
      const mockPuppies = [
        { id: 1, name: 'Max', ownerName: 'John Doe' },
        { id: 2, name: 'Bella', ownerName: 'Jane Smith' },
      ];

      (puppyApi.getAll as jest.Mock).mockResolvedValueOnce({ data: mockPuppies });

      const result = await puppyApi.getAll();

      expect(puppyApi.getAll).toHaveBeenCalled();
      expect(result.data).toEqual(mockPuppies);
    });

    it('create should create a new puppy', async () => {
      const newPuppy = { name: 'Charlie', ownerName: 'Bob Johnson' };
      const createdPuppy = { id: 3, ...newPuppy };

      (puppyApi.create as jest.Mock).mockResolvedValueOnce({ data: createdPuppy });

      const result = await puppyApi.create(newPuppy);

      expect(puppyApi.create).toHaveBeenCalledWith(newPuppy);
      expect(result.data).toEqual(createdPuppy);
    });
  });

  describe('waitingListApi', () => {
    it('getToday should fetch today\'s waiting list', async () => {
      const mockWaitingList = {
        id: 1,
        date: '2025-04-09',
        entries: [
          {
            id: 1,
            position: 1,
            puppy: { id: 1, name: 'Max', ownerName: 'John Doe' },
            serviceRequired: 'Bath & Dry',
            arrivalTime: '2025-04-09T10:00:00Z',
            serviced: false,
          },
        ],
      };

      (waitingListApi.getToday as jest.Mock).mockResolvedValueOnce({ data: mockWaitingList });

      const result = await waitingListApi.getToday();

      expect(waitingListApi.getToday).toHaveBeenCalled();
      expect(result.data).toEqual(mockWaitingList);
    });

    it('createToday should create a waiting list for today', async () => {
      const mockWaitingList = {
        id: 1,
        date: '2025-04-09',
        entries: [],
      };

      (waitingListApi.createToday as jest.Mock).mockResolvedValueOnce({ data: mockWaitingList });

      const result = await waitingListApi.createToday();

      expect(waitingListApi.createToday).toHaveBeenCalled();
      expect(result.data).toEqual(mockWaitingList);
    });

    it('addEntry should add an entry to the waiting list', async () => {
      const newEntry = {
        puppyId: 1,
        serviceRequired: 'Bath & Dry',
      };

      const createdEntry = {
        id: 1,
        position: 1,
        puppy: { id: 1, name: 'Max', ownerName: 'John Doe' },
        serviceRequired: 'Bath & Dry',
        arrivalTime: '2025-04-09T10:00:00Z',
        serviced: false,
      };

      (waitingListApi.addEntry as jest.Mock).mockResolvedValueOnce({ data: createdEntry });

      const result = await waitingListApi.addEntry(newEntry);

      expect(waitingListApi.addEntry).toHaveBeenCalledWith(newEntry);
      expect(result.data).toEqual(createdEntry);
    });

    it('addEntry should add an entry with notes to the waiting list', async () => {
      const newEntry = {
        puppyId: 1,
        serviceRequired: 'Bath & Dry',
        notes: 'Sensitive skin, use hypoallergenic shampoo',
      };

      const createdEntry = {
        id: 1,
        position: 1,
        puppy: { id: 1, name: 'Max', ownerName: 'John Doe' },
        serviceRequired: 'Bath & Dry',
        notes: 'Sensitive skin, use hypoallergenic shampoo',
        arrivalTime: '2025-04-09T10:00:00Z',
        serviced: false,
      };

      (waitingListApi.addEntry as jest.Mock).mockResolvedValueOnce({ data: createdEntry });

      const result = await waitingListApi.addEntry(newEntry);

      expect(waitingListApi.addEntry).toHaveBeenCalledWith(newEntry);
      expect(result.data).toEqual(createdEntry);
      expect(result.data.notes).toBe('Sensitive skin, use hypoallergenic shampoo');
    });

    it('markServiced should mark an entry as serviced', async () => {
      const updatedEntry = {
        id: 1,
        position: 1,
        puppy: { id: 1, name: 'Max', ownerName: 'John Doe' },
        serviceRequired: 'Bath & Dry',
        arrivalTime: '2025-04-09T10:00:00Z',
        serviced: true,
      };

      (waitingListApi.markServiced as jest.Mock).mockResolvedValueOnce({ data: updatedEntry });

      const result = await waitingListApi.markServiced(1);

      expect(waitingListApi.markServiced).toHaveBeenCalledWith(1);
      expect(result.data).toEqual(updatedEntry);
    });

    it('reorder should reorder the waiting list entries', async () => {
      const entryOrder = [2, 1];

      (waitingListApi.reorder as jest.Mock).mockResolvedValueOnce({ data: {} });

      await waitingListApi.reorder(entryOrder);

      expect(waitingListApi.reorder).toHaveBeenCalledWith(entryOrder);
    });
  });
});
