import { Test, TestingModule } from '@nestjs/testing';
import { PartesTrabajoService } from './partes_trabajo.service';

describe('PartesTrabajoService', () => {
  let service: PartesTrabajoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartesTrabajoService],
    }).compile();

    service = module.get<PartesTrabajoService>(PartesTrabajoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
