import { IsDateString, IsOptional } from 'class-validator';

export class StatisticsQueryDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class StatisticsResponseDto {
  totalPuppies: number;
  servicedPuppies: number;
  mostPopularService: string;
  serviceBreakdown: Record<string, number>;
  dailyTotals: Record<string, number>;
  averageWaitTime?: number;
}
