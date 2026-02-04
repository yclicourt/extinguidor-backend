import { Test, TestingModule } from '@nestjs/testing';
import { ChekinController } from './cheking.controller';
import { ChekinService } from './cheking.service';

describe('ChekinController', () => {
  let controller: ChekinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChekinController],
      providers: [ChekinService],
    }).compile();

    controller = module.get<ChekinController>(ChekinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
