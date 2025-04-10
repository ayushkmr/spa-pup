import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { PuppyService } from './puppy.service';
import { CreatePuppyDto } from './dto/create-puppy.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('puppy')
export class PuppyController {
  constructor(private readonly puppyService: PuppyService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createPuppy(@Body() createPuppyDto: CreatePuppyDto) {
    return this.puppyService.createPuppy(createPuppyDto.name, createPuppyDto.ownerName);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchPuppies(@Query('q') q: string) {
    return this.puppyService.searchPuppies(q);
  }

  @Get('all')
  async getAllPuppies() {
    return this.puppyService.getAllPuppies();
  }
}
