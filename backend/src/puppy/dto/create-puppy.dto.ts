import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePuppyDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  ownerName: string;
}
