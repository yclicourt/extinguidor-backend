import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Role } from './enums/user.enum';

import { Status } from 'generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  // Method to validate roles
  private validateRoles(roles: unknown): Role[] {
    // If roles is undefined or null, return the default value
    if (!roles) {
      return [Role.TRABAJADOR];
    }

    // Verify if roles is an array
    if (!Array.isArray(roles)) {
      throw new Error('Formato de roles inválido: debe ser un array');
    }

    // Normalized roles to ensure they are in the correct format
    const normalizedRoles = roles
      .map((role) => {
        if (typeof role === 'string') {
          const upperRole = role.toUpperCase().trim();

          // For example, if the role is 'administrador' or 'trabajador', convert it to 'ADMINISTRADOR' or 'TRABAJADOR'
          if (upperRole === 'ADMINISTRADOR') return Role.ADMINISTRADOR;
          if (upperRole === 'TRABAJADOR') return Role.TRABAJADOR;

          // Verify if the role is a valid enum value
          if (Object.values(Role).includes(upperRole as Role)) {
            return upperRole as Role;
          }
        }
        return null;
      })
      .filter((role): role is Role => role !== null);

    // If there are no valid roles, return the default value
    if (normalizedRoles.length === 0) {
      return [Role.TRABAJADOR];
    }

    return normalizedRoles;
  }

  // Method to update user status
  async updateUserStatus(
    userId: number,
    data: { status: Status; lastLogin: Date },
  ) {
    return await this.prisma.usuario.update({
      where: {
        id: userId,
      },
      data: {
        status: data.status as Status | undefined,
        lastLogin: data.lastLogin,
      },
    });
  }
  // Method to create a user
  async createUserItem(data: CreateUserDto) {
    const validRoles = this.validateRoles(data.role);
    return await this.prisma.usuario.create({
      data: {
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        phone: data.phone,
        address: data.address,
        avatar: data.avatar || undefined,
        role: validRoles,
      },
    });
  }

  // Method to get all users
  getAllUserItems() {
    return this.prisma.usuario.findMany({
      omit: {
        password: true,
      },
    });
  }

  // Method to get a user by email
  async getUserByEmail(email: string) {
    const userFound = await this.prisma.usuario.findUnique({
      where: {
        email,
      },
    });
    return userFound;
  }

  // Method to get a user by id
  async getUserItem(id: number) {
    const userFound = await this.prisma.usuario.findUnique({
      omit: {
        password: true,
      },
      where: {
        id,
      },
    });
    if (!userFound) throw new HttpException('User not found', 404);
    return userFound;
  }

  // Method to update a user
  async updateUserItem(id: number, updateUserDTO: UpdateUserDto) {
    const userFound = await this.getUserItem(id);
    if (!userFound) throw new HttpException('User not found', 404);

    const roles =
      updateUserDTO.role || (updateUserDTO['role[]'] as Role[] | undefined);

    if (roles && !Array.isArray(updateUserDTO.role)) {
      throw new HttpException(
        'Role must be provided as an array (e.g. ["TRABAJADOR"])',
        400,
      );
    }

    return await this.prisma.usuario.update({
      where: {
        id,
      },
      data: {
        name: updateUserDTO.name,
        lastname: updateUserDTO.lastname,
        email: updateUserDTO.email,
        password: updateUserDTO.password,
        phone: updateUserDTO.phone,
        address: updateUserDTO.address,
        role: this.validateAndNormalizeRoles(roles),
      },
    });
  }

  // Method to validate and normalize roles
  private validateAndNormalizeRoles(roles: Role[] | undefined): Role[] {
    // If no role was provided, return array with USER by default
    if (!roles) return [Role.TRABAJADOR];

    // Make sure it is an array
    if (!Array.isArray(roles)) {
      throw new HttpException('Roles must be provided as an array', 400);
    }

    if (typeof roles === 'object' && !Array.isArray(roles)) {
      roles = Object.values(roles);
    }

    // Validate each role
    const invalidRoles = roles.filter((r) => !Object.values(Role).includes(r));
    if (invalidRoles.length > 0) {
      throw new HttpException(
        `Invalid role values: ${invalidRoles.join(', ')}. Valid roles are: ${Object.values(Role).join(', ')}`,
        400,
      );
    }

    //Return validated array (delete duplicates if necessary)
    return [...new Set(roles)];
  }

  // Method to delete a user
  async deleteUserItem(id: number) {
    const userFound = await this.getUserItem(id);
    if (!userFound) throw new HttpException('User not found', 404);
    return await this.prisma.usuario.delete({
      where: {
        id,
      },
    });
  }

  // Method to delete multiple users
  async deleteMultipleUsersItems(ids: number[]) {
    // Verify that all users exist before deleting
    const existingUsers = await this.prisma.usuario.findMany({
      where: {
        id: { in: ids },
      },
    });

    const existingIds = existingUsers.map((user) => user.id);
    const missingIds = ids.filter((id) => !existingIds.includes(id));

    if (missingIds.length > 0) {
      throw new HttpException(
        `Users with IDs ${missingIds.join(', ')} not found`,
        404,
      );
    }

    // Delete all found users
    return await this.prisma.usuario.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }
}
