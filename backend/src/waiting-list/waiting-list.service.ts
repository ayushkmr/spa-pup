import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatisticsResponseDto } from './dto/statistics.dto';
import { format, parseISO, differenceInMinutes } from 'date-fns';

@Injectable()
export class WaitingListService {
  constructor(private prisma: PrismaService) {}

  async createTodayList() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.prisma.waitingList.upsert({
      where: { date: today },
      update: {},
      create: { date: today },
    });
  }

  async addEntryToTodayList(
    puppyId: number,
    serviceRequired: string,
    arrivalTime?: Date,
    notes?: string,
    scheduledTime?: Date,
    isFutureBooking?: boolean
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const waitingList = await this.prisma.waitingList.findUnique({ where: { date: today } });
    if (!waitingList) throw new Error('Today\'s waiting list does not exist');

    const maxPosition = await this.prisma.waitingListEntry.aggregate({
      where: { waitingListId: waitingList.id },
      _max: { position: true },
    });

    console.log('Creating entry with notes:', notes);
    console.log('Future booking:', isFutureBooking, 'Scheduled time:', scheduledTime);

    const result = await this.prisma.waitingListEntry.create({
      data: {
        waitingListId: waitingList.id,
        puppyId,
        serviceRequired,
        notes,
        arrivalTime: arrivalTime ?? new Date(),
        scheduledTime,
        isFutureBooking: isFutureBooking ?? false,
        position: (maxPosition._max.position ?? 0) + 1,
      },
    });

    console.log('Created entry:', result);
    return result;
  }

  async getTodayList() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const result = await this.prisma.waitingList.findUnique({
      where: { date: today },
      include: {
        entries: {
          orderBy: { position: 'asc' },
          include: { puppy: true },
        },
      },
    });

    console.log('Today\'s list entries:', result?.entries);
    return result;
  }

  async reorderEntries(entryOrder: number[]) {
    const updates = entryOrder.map((id, index) =>
      this.prisma.waitingListEntry.update({
        where: { id },
        data: { position: index + 1 },
      })
    );
    return this.prisma.$transaction(updates);
  }

  async markEntryServiced(entryId: number) {
    return this.prisma.waitingListEntry.update({
      where: { id: entryId },
      data: {
        serviced: true,
        serviceTime: new Date(), // Set the service time to now
        status: 'completed'
      },
    });
  }

  async cancelEntry(entryId: number) {
    return this.prisma.waitingListEntry.update({
      where: { id: entryId },
      data: {
        status: 'cancelled'
      },
    });
  }

  async updatePastAppointments() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all waiting entries from past days
    const pastEntries = await this.prisma.waitingListEntry.findMany({
      where: {
        status: 'waiting',
        waitingList: {
          date: {
            lt: today
          }
        }
      }
    });

    // Update all past waiting entries to cancelled
    if (pastEntries.length > 0) {
      await this.prisma.waitingListEntry.updateMany({
        where: {
          id: {
            in: pastEntries.map(entry => entry.id)
          }
        },
        data: {
          status: 'cancelled'
        }
      });

      console.log(`Updated ${pastEntries.length} past entries to cancelled`);
    }

    return pastEntries.length;
  }

  async getListByDate(date: Date) {
    date.setHours(0, 0, 0, 0);
    return this.prisma.waitingList.findUnique({
      where: { date },
      include: {
        entries: {
          orderBy: { position: 'asc' },
          include: { puppy: true },
        },
      },
    });
  }

  async getStatistics(startDate?: string, endDate?: string): Promise<StatisticsResponseDto> {
    // Set default date range if not provided
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = startDate
      ? new Date(startDate)
      : new Date(today.getFullYear(), today.getMonth(), 1); // First day of current month

    const end = endDate
      ? new Date(endDate)
      : today;

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // Get all waiting lists in the date range
    const waitingLists = await this.prisma.waitingList.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        entries: {
          include: {
            puppy: true,
          },
        },
      },
    });

    // Initialize statistics
    const serviceBreakdown: Record<string, number> = {};
    const dailyTotals: Record<string, number> = {};
    let totalPuppies = 0;
    let servicedPuppies = 0;
    let totalWaitTime = 0;
    let servicedCount = 0;

    // Process each waiting list
    waitingLists.forEach(list => {
      const dateStr = format(list.date, 'yyyy-MM-dd');
      dailyTotals[dateStr] = list.entries.length;
      totalPuppies += list.entries.length;

      // Process each entry
      list.entries.forEach(entry => {
        // Count serviced puppies
        if (entry.serviced) {
          servicedPuppies++;

          // Calculate wait time if service time exists
          if (entry.serviceTime) {
            const waitTime = differenceInMinutes(entry.serviceTime, entry.arrivalTime);
            totalWaitTime += waitTime;
            servicedCount++;
          }
        }

        // Update service breakdown
        const service = entry.serviceRequired;
        serviceBreakdown[service] = (serviceBreakdown[service] || 0) + 1;
      });
    });

    // Find most popular service
    let mostPopularService = '';
    let maxCount = 0;

    Object.entries(serviceBreakdown).forEach(([service, count]) => {
      if (count > maxCount) {
        mostPopularService = service;
        maxCount = count;
      }
    });

    // Calculate average wait time
    const averageWaitTime = servicedCount > 0 ? Math.round(totalWaitTime / servicedCount) : 0;

    return {
      totalPuppies,
      servicedPuppies,
      mostPopularService,
      serviceBreakdown,
      dailyTotals,
      averageWaitTime,
    };
  }

  async getAllLists() {
    return this.prisma.waitingList.findMany({
      orderBy: { date: 'desc' },
      include: {
        entries: {
          orderBy: { position: 'asc' },
          include: { puppy: true },
        },
        _count: {
          select: { entries: true },
        },
      },
    });
  }

  async searchWaitingListHistory(query: string) {
    // Find puppies matching the query
    const puppies = await this.prisma.puppy.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { ownerName: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true },
    });

    const puppyIds = puppies.map((puppy) => puppy.id);

    // Find entries for these puppies
    return this.prisma.waitingListEntry.findMany({
      where: {
        OR: [
          { puppyId: { in: puppyIds } },
          { serviceRequired: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        puppy: true,
        waitingList: true,
      },
      orderBy: [
        { waitingList: { date: 'desc' } },
        { position: 'asc' },
      ],
    });
  }
}
