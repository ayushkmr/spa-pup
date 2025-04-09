import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PuppyService } from './puppy.service';

@Controller('puppy')
export class PuppyController {
  constructor(private readonly puppyService: PuppyService) {}

  @Post('create')
  async createPuppy(
    @Body() body: { name: string; ownerName: string }
  ) {
    return this.puppyService.createPuppy(body.name, body.ownerName);
  }

  @Get('search')
  async searchPuppies(@Query('q') q: string) {
    return this.puppyService.searchPuppies(q);
  }
}
