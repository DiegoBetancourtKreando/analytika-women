import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserRole, UserStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret = process.env.JWT_SECRET || 'analytika-jwt-secret';
  private readonly refreshTokenSecret =
    process.env.JWT_REFRESH_SECRET || 'analytika-refresh-secret';
  private readonly refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const tokens = this.generateTokens(user);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: tokens.refreshToken,
        lastLoginAt: new Date(),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
      },
      ...tokens,
    };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: UserRole.CLIENT,
        status: UserStatus.ACTIVE,
      },
    });

    const tokens = this.generateTokens(user);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = jwt.verify(dto.refreshToken, this.refreshTokenSecret) as {
        id: string;
        email: string;
      };

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user || user.refreshToken !== dto.refreshToken) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      const tokens = this.generateTokens(user);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: tokens.refreshToken },
      });

      return tokens;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Refresh token expirado');
      }
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    if (user.deletedAt) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  private generateTokens(user: { id: string; email: string; role: string; status: string }) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      this.refreshTokenSecret,
      { expiresIn: this.refreshTokenExpiry } as any,
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 86400,
    };
  }
}
