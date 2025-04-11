import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WaitingListModule } from './waiting-list/waiting-list.module';
import { PuppyModule } from './puppy/puppy.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UpdatePastAppointmentsCron } from './cron/update-past-appointments.cron';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    WaitingListModule,
    PuppyModule,
    PrismaModule,
    AuthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService, UpdatePastAppointmentsCron],
})
export class AppModule {}
