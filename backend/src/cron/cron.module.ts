import { Module } from '@nestjs/common';
import { UpdatePastAppointmentsCron } from './update-past-appointments.cron';
import { WaitingListModule } from '../waiting-list/waiting-list.module';

@Module({
  imports: [WaitingListModule],
  providers: [UpdatePastAppointmentsCron],
})
export class CronModule {}
