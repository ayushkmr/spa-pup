import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

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

  async addEntryToTodayList(puppyId: number, serviceRequired: string, arrivalTime?: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const waitingList = await this.prisma.waitingList.findUnique({ where: { date: today } });
    if (!waitingList) throw new Error('Today\'s waiting list does not exist');

    const maxPosition = await this.prisma.waitingListEntry.aggregate({
      where: { waitingListId: waitingList.id },
      _max: { position: true },
    });

    return this.prisma.waitingListEntry.create({
      data: {
        waitingListId: waitingList.id,
        puppyId,
        serviceRequired,
        arrivalTime: arrivalTime ?? new Date(),
        position: (maxPosition._max.position ?? 0) + 1,
      },
    });
  }

  async getTodayList() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.prisma.waitingList.findUnique({
      where: { date: today },
      include: {
        entries: {
          orderBy: { position: 'asc' },
          include: { puppy: true },
        },
      },
    });
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
      data: { serviced: true },
    });
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
