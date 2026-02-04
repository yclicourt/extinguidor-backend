import { Test, TestingModule } from '@nestjs/testing';
import { PartesTrabajoController } from './partes_trabajo.controller';
import { PartesTrabajoService } from './partes_trabajo.service';

describe('PartesTrabajoController', () => {
  let controller: PartesTrabajoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartesTrabajoController],
      providers: [PartesTrabajoService],
    }).compile();

    controller = module.get<PartesTrabajoController>(PartesTrabajoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
