import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WaitingListService } from '../waiting-list/waiting-list.service';

@Injectable()
export class UpdateScheduledAppointmentsCron {
  private readonly logger = new Logger(UpdateScheduledAppointmentsCron.name);

  constructor(private readonly waitingListService: WaitingListService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.log('Running cron job to update scheduled appointments');
    try {
      const count = await this.waitingListService.updateScheduledAppointments();
      if (count > 0) {
        this.logger.log(`Updated ${count} scheduled appointments to waiting status`);
      }
    } catch (error) {
      this.logger.error('Error updating scheduled appointments', error);
    }
  }
}
