import { IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class CreatePuppyDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  ownerName: string;

  @IsString()
  @IsOptional()
  breed?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
