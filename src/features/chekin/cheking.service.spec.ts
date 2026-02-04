import { Test, TestingModule } from '@nestjs/testing';
import { ChekinService } from './cheking.service';

describe('ChekinService', () => {
  let service: ChekinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChekinService],
    }).compile();

    service = module.get<ChekinService>(ChekinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
