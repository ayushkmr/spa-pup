import { Module } from '@nestjs/common';
import { WaitingListService } from './waiting-list.service';
import { WaitingListController } from './waiting-list.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [WaitingListService],
  controllers: [WaitingListController],
  exports: [WaitingListService]
})
export class WaitingListModule {}
