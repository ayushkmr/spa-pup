import { Controller, Post, Get, Body, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { WaitingListService } from './waiting-list.service';
import { AddEntryDto } from './dto/add-entry.dto';
import { ReorderEntriesDto } from './dto/reorder-entries.dto';
import { StatisticsQueryDto, StatisticsResponseDto } from './dto/statistics.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('waiting-list')
export class WaitingListController {
  constructor(private readonly waitingListService: WaitingListService) {}

  @Post('create-today')
  @UseGuards(JwtAuthGuard)
  async createTodayList() {
    return this.waitingListService.createTodayList();
  }

  @Post('add-entry')
  @UseGuards(JwtAuthGuard)
  async addEntry(@Body() addEntryDto: AddEntryDto) {
    console.log('Adding entry with notes:', addEntryDto.notes);
    return this.waitingListService.addEntryToTodayList(
      addEntryDto.puppyId,
      addEntryDto.serviceRequired,
      addEntryDto.arrivalTime,
      addEntryDto.notes
    );
  }

  @Get('today')
  async getTodayList() {
    return this.waitingListService.getTodayList();
  }

  @Patch('reorder')
  @UseGuards(JwtAuthGuard)
  async reorderEntries(@Body() reorderEntriesDto: ReorderEntriesDto) {
    console.log('Reordering entries:', reorderEntriesDto.entryOrder);
    try {
      const result = await this.waitingListService.reorderEntries(reorderEntriesDto.entryOrder);
      console.log('Reordering successful. New order:',
        result.map(entry => `ID: ${entry.id}, Position: ${entry.position}, Puppy: ${entry.puppyId}`));
      return result;
    } catch (error) {
      console.error('Error reordering entries:', error);
      throw error;
    }
  }

  @Patch('mark-serviced/:entryId')
  @UseGuards(JwtAuthGuard)
  async markServiced(@Param('entryId') entryId: number) {
    return this.waitingListService.markEntryServiced(entryId);
  }

  @Get('history/:date')
  @UseGuards(JwtAuthGuard)
  async getListByDate(@Param('date') date: string) {
    return this.waitingListService.getListByDate(new Date(date));
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllLists() {
    return this.waitingListService.getAllLists();
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchWaitingListHistory(@Query('q') query: string) {
    return this.waitingListService.searchWaitingListHistory(query);
  }

  @Get('statistics')
  @UseGuards(JwtAuthGuard)
  async getStatistics(@Query() query: StatisticsQueryDto): Promise<StatisticsResponseDto> {
    return this.waitingListService.getStatistics(query.startDate, query.endDate);
  }
}
