import { Test, TestingModule } from '@nestjs/testing';
import { PuppyService } from './puppy.service';

describe('PuppyService', () => {
  let service: PuppyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PuppyService],
    }).compile();

    service = module.get<PuppyService>(PuppyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
