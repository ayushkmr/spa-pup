import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class ReorderEntriesDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  entryOrder: number[];
}
