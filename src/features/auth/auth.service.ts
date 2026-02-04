/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcryptjs from 'bcryptjs';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interfaces';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/integrations/mail/mail.service';
import { RegisterUserPayload } from './interfaces/register-user-payload.interface';
import { RegisterUserAdminPayload } from './interfaces/register-user-admin-payload.interface';
import { Role } from './enums/role.enum';
import { Status } from 'generated/prisma/enums';


@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async registerUser({
    address,
    email,
    password,
    phone,
    name,
    lastname,
    avatar,
  }: RegisterUserPayload) {
    const usuario = await this.usuarioService.getUserByEmail(email);

    if (usuario) throw new HttpException('user already exists', 400);

    await this.usuarioService.createUserItem({
      address,
      name,
      lastname,
      email,
      phone,
      password: await bcryptjs.hash(password, 10),
      avatar,
    });
    return {
      address,
      email,
    };
  }

  async registerUserAdmin({
    role,
    avatar,
    ...registerAdminData
  }: RegisterUserAdminPayload) {
    const usuario = await this.usuarioService.getUserByEmail(
      registerAdminData.email,
    );

    if (usuario) throw new HttpException('user already exists', 400);

    try {
      await this.usuarioService.createUserItem({
        role,
        avatar,
        ...registerAdminData,
        password: await bcryptjs.hash(registerAdminData.password, 10),
      });
      return new HttpException('user created succeffully', 201);
    } catch (error) {
      console.log(error);
      throw new HttpException('user not created', 404);
    }
  }

  async loginUser({ email, password }: LoginAuthDto) {
    try {
      // Verify if usuario exists
      const usuario = await this.usuarioService.getUserByEmail(email);
      if (!usuario) throw new HttpException('Invalid Credentials', 401);

      // Only reject if the usuario has a previous login and was marked as inactive
      if (usuario.status === 'INACTIVO' && usuario.lastLogin === null) {
        throw new HttpException('Account is not active', 401);
      }

      // Verify if usuario is same as the one in the database
      const isPasswordValid = await bcryptjs.compare(
        password,
        usuario.password,
      );
      if (!isPasswordValid) throw new HttpException('Invalid Credentials', 401);

      // Update status to ACTIVO
      await this.usuarioService.updateUserStatus(usuario.id, {
        status: Status.ACTIVO,
        lastLogin: new Date(),
      });

      // Getting usuario roles
      const usuarioRoles = this.validateAndNormalizeRoles(usuario.role);

      // Payload for JWT
      const payload: JwtPayload = {
        email: usuario.email,
        roles: usuarioRoles,
      };

      const {
        password: _,
        createdAt: __,
        updatedAt: ___,
        ...safeusuario
      } = usuario;
      return {
        token: await this.jwtService.signAsync(payload),
        usuario: safeusuario,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new UnauthorizedException(error.message);
      }
      throw new UnauthorizedException('Authentication error');
    }
  }

  // Method to validate and normalizes roles
  private validateAndNormalizeRoles(roles: unknown): Role[] {
    // If roles is undefined or null, return the default value
    if (!roles) {
      return [Role.TRABAJADOR];
    }

    // Make sure it is an array
    if (!Array.isArray(roles)) {
      throw new Error('Roles Format invalid: must be an array');
    }

    // Normalize roles
    const normalizedRoles = roles
      .map((role) => {
        if (typeof role === 'string') {
          const upperRole = role.toUpperCase().trim();

          // Manage possible name discrepancies
          if (upperRole === 'ADMIN') return Role.ADMINISTRADOR;
          if (upperRole === 'trabajador') return Role.TRABAJADOR;

          // Check against enum
          if (Object.values(Role).includes(upperRole as Role)) {
            return upperRole as Role;
          }
        }
        return null;
      })
      .filter((role): role is Role => role !== null);

    // If no valid roles, return the default value
    if (normalizedRoles.length === 0) {
      return [Role.TRABAJADOR];
    }

    return normalizedRoles;
  }

  // Method to handle a forgot password
  async forgotPassword({ email }: ForgotPasswordDto) {
    // Check if the usuario exists
    const usuario = await this.usuarioService.getUserByEmail(email);
    if (!usuario) {
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    // Save token in the database
    await this.prisma.usuario.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send email with the reset link
    const resetUrl = `${this.configService.get<string>('ORIGIN_CLIENT')}/reset-password?token=${resetToken}`;
    try {
      await this.mailService.sendPasswordResetEmail(
        email,
        usuario.name || 'user',
        resetUrl,
      );
      return { message: 'Password reset link sent to your email' };
    } catch (error) {
      console.error(`Error to sending email to ${email}:`, error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  // Method to handle a reset password
  async resetPassword(token: string, newPassword: string) {
    //Search usuario by token
    const usuario = await this.prisma.usuario.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Token not expired
        },
      },
    });

    if (!usuario) {
      throw new BadRequestException('Invalid or expired token');
    }

    //  Hash the new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update usuario
    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Password updated successfully' };
  }
}
