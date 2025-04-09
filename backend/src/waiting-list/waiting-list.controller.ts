import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
import { WaitingListService } from './waiting-list.service';

@Controller('waiting-list')
export class WaitingListController {
  constructor(private readonly waitingListService: WaitingListService) {}

  @Post('create-today')
  async createTodayList() {
    return this.waitingListService.createTodayList();
  }

  @Post('add-entry')
  async addEntry(
    @Body() body: { puppyId: number; serviceRequired: string; arrivalTime?: Date }
  ) {
    return this.waitingListService.addEntryToTodayList(body.puppyId, body.serviceRequired, body.arrivalTime);
  }

  @Get('today')
  async getTodayList() {
    return this.waitingListService.getTodayList();
  }

  @Patch('reorder')
  async reorderEntries(@Body() body: { entryOrder: number[] }) {
    return this.waitingListService.reorderEntries(body.entryOrder);
  }

  @Patch('mark-serviced/:entryId')
  async markServiced(@Param('entryId') entryId: number) {
    return this.waitingListService.markEntryServiced(entryId);
  }

  @Get('history/:date')
  async getListByDate(@Param('date') date: string) {
    return this.waitingListService.getListByDate(new Date(date));
  }
}
