import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WaitingListService } from '../waiting-list/waiting-list.service';

@Injectable()
export class UpdatePastAppointmentsCron {
  private readonly logger = new Logger(UpdatePastAppointmentsCron.name);

  constructor(private readonly waitingListService: WaitingListService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log('Running cron job to update past appointments');
    try {
      const count = await this.waitingListService.updatePastAppointments();
      this.logger.log(`Updated ${count} past appointments to cancelled status`);
    } catch (error) {
      this.logger.error('Error updating past appointments', error);
    }
  }
}
