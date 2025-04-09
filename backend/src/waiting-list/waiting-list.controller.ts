import { Controller, Post, Get, Body, Param, Patch, Query } from '@nestjs/common';
import { WaitingListService } from './waiting-list.service';
import { AddEntryDto } from './dto/add-entry.dto';
import { ReorderEntriesDto } from './dto/reorder-entries.dto';

@Controller('waiting-list')
export class WaitingListController {
  constructor(private readonly waitingListService: WaitingListService) {}

  @Post('create-today')
  async createTodayList() {
    return this.waitingListService.createTodayList();
  }

  @Post('add-entry')
  async addEntry(@Body() addEntryDto: AddEntryDto) {
    return this.waitingListService.addEntryToTodayList(
      addEntryDto.puppyId,
      addEntryDto.serviceRequired,
      addEntryDto.arrivalTime
    );
  }

  @Get('today')
  async getTodayList() {
    return this.waitingListService.getTodayList();
  }

  @Patch('reorder')
  async reorderEntries(@Body() reorderEntriesDto: ReorderEntriesDto) {
    return this.waitingListService.reorderEntries(reorderEntriesDto.entryOrder);
  }

  @Patch('mark-serviced/:entryId')
  async markServiced(@Param('entryId') entryId: number) {
    return this.waitingListService.markEntryServiced(entryId);
  }

  @Get('history/:date')
  async getListByDate(@Param('date') date: string) {
    return this.waitingListService.getListByDate(new Date(date));
  }

  @Get('all')
  async getAllLists() {
    return this.waitingListService.getAllLists();
  }

  @Get('search')
  async searchWaitingListHistory(@Query('q') query: string) {
    return this.waitingListService.searchWaitingListHistory(query);
  }
}
