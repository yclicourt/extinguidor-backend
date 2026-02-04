import { Role } from '../enums/role.enum';

export interface JwtPayload {
  email: string;
  roles: Role[];
}
