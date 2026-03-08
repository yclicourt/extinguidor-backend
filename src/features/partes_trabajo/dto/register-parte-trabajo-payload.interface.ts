import { CreatePartesTrabajoDto } from './create-partes_trabajo.dto';

export type RegisterParteTrabajoPayload = CreatePartesTrabajoDto & {
  imageDoc?: string;
  docs?: string;
};
