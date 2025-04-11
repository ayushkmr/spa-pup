import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDate, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class AddEntryDto {
  @IsNumber()
  @IsNotEmpty()
  puppyId: number;

  @IsString()
  @IsNotEmpty()
  serviceRequired: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  arrivalTime?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  scheduledTime?: Date;

  @IsOptional()
  @IsBoolean()
  isFutureBooking?: boolean;
}
