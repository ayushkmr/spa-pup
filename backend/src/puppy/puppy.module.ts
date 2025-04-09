import { Module } from '@nestjs/common';
import { PuppyService } from './puppy.service';
import { PuppyController } from './puppy.controller';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PuppyService],
  controllers: [PuppyController]
})
export class PuppyModule {}
