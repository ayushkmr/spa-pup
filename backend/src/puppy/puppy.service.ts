import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PuppyService {
  constructor(private prisma: PrismaService) {}

  async createPuppy(name: string, ownerName: string) {
    return this.prisma.puppy.create({
      data: { name, ownerName },
    });
  }

  async searchPuppies(query: string) {
    return this.prisma.puppy.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { ownerName: { contains: query, mode: 'insensitive' } },
        ],
      },
    });
  }

  async getAllPuppies() {
    return this.prisma.puppy.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
