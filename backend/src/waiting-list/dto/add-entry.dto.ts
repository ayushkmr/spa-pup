import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class AddEntryDto {
  @IsNumber()
  @IsNotEmpty()
  puppyId: number;

  @IsString()
  @IsNotEmpty()
  serviceRequired: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  arrivalTime?: Date;
}
