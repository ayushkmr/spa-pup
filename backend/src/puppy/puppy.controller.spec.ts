import { Test, TestingModule } from '@nestjs/testing';
import { PuppyController } from './puppy.controller';

describe('PuppyController', () => {
  let controller: PuppyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PuppyController],
    }).compile();

    controller = module.get<PuppyController>(PuppyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
