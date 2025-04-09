import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WaitingListModule } from './waiting-list/waiting-list.module';
import { PuppyModule } from './puppy/puppy.module';

import { PrismaService } from './prisma.service';

@Module({
  imports: [WaitingListModule, PuppyModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
