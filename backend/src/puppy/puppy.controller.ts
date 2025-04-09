import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PuppyService } from './puppy.service';
import { CreatePuppyDto } from './dto/create-puppy.dto';

@Controller('puppy')
export class PuppyController {
  constructor(private readonly puppyService: PuppyService) {}

  @Post('create')
  async createPuppy(@Body() createPuppyDto: CreatePuppyDto) {
    return this.puppyService.createPuppy(createPuppyDto.name, createPuppyDto.ownerName);
  }

  @Get('search')
  async searchPuppies(@Query('q') q: string) {
    return this.puppyService.searchPuppies(q);
  }

  @Get('all')
  async getAllPuppies() {
    return this.puppyService.getAllPuppies();
  }
}
